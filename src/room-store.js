import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";

export const roomLifetimeMilliseconds = 12 * 60 * 60 * 1000;
const roomLifetimeSeconds = roomLifetimeMilliseconds / 1000;
const roomLockMilliseconds = 5_000;
const roomLockAttempts = 40;
const roomLockRetryMilliseconds = 50;

function normalizedCode(code) {
  return String(code).toUpperCase();
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class MemoryRoomStore {
  constructor({ now = Date.now } = {}) {
    this.now = now;
    this.rooms = new Map();
    this.kind = "memory";
  }

  async create(code, room) {
    const key = normalizedCode(code);
    if (this.rooms.has(key)) return false;
    this.rooms.set(key, structuredClone(room));
    return true;
  }

  async get(code) {
    const room = this.rooms.get(normalizedCode(code));
    return room ? structuredClone(room) : null;
  }

  async update(code, updater) {
    const key = normalizedCode(code);
    const storedRoom = this.rooms.get(key);
    if (!storedRoom) throw new Error("Room not found.");
    const room = structuredClone(storedRoom);
    const result = await updater(room);
    room.lastSeenAt = this.now();
    this.rooms.set(key, structuredClone(room));
    return result;
  }

  async remove(code, validator = null) {
    const key = normalizedCode(code);
    const room = this.rooms.get(key);
    if (!room) throw new Error("Room not found.");
    if (validator) await validator(room);
    this.rooms.delete(key);
  }

  cleanupExpired() {
    const expiry = this.now() - roomLifetimeMilliseconds;
    for (const [code, room] of this.rooms) {
      if (room.lastSeenAt < expiry) this.rooms.delete(code);
    }
  }

  localRooms() {
    return this.rooms.values();
  }
}

export class RedisRoomStore {
  constructor(redis, { now = Date.now } = {}) {
    this.redis = redis;
    this.now = now;
    this.kind = "redis";
  }

  roomKey(code) {
    return `pokemon-splendor:room:${normalizedCode(code)}`;
  }

  lockKey(code) {
    return `${this.roomKey(code)}:lock`;
  }

  async create(code, room) {
    const result = await this.redis.set(this.roomKey(code), room, { nx: true, ex: roomLifetimeSeconds });
    return result === "OK";
  }

  async get(code) {
    return this.redis.get(this.roomKey(code));
  }

  async acquireLock(code) {
    const key = this.lockKey(code);
    const token = randomUUID();
    for (let attempt = 0; attempt < roomLockAttempts; attempt += 1) {
      const result = await this.redis.set(key, token, { nx: true, px: roomLockMilliseconds });
      if (result === "OK") return token;
      await wait(roomLockRetryMilliseconds);
    }
    throw new Error("Room is busy. Try again.");
  }

  async releaseLock(code, token) {
    const script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
    await this.redis.eval(script, [this.lockKey(code)], [token]);
  }

  async update(code, updater) {
    const token = await this.acquireLock(code);
    try {
      const key = this.roomKey(code);
      const room = await this.redis.get(key);
      if (!room) throw new Error("Room not found.");
      const result = await updater(room);
      room.lastSeenAt = this.now();
      await this.redis.set(key, room, { ex: roomLifetimeSeconds });
      return result;
    } finally {
      await this.releaseLock(code, token);
    }
  }

  async remove(code, validator = null) {
    const token = await this.acquireLock(code);
    try {
      const key = this.roomKey(code);
      const room = await this.redis.get(key);
      if (!room) throw new Error("Room not found.");
      if (validator) await validator(room);
      await this.redis.del(key);
    } finally {
      await this.releaseLock(code, token);
    }
  }

  cleanupExpired() {}

  localRooms() {
    return [];
  }
}

export function createRoomStore({ environment = process.env, redis = null, now = Date.now } = {}) {
  const credentialPairs = [
    { url: environment.UPSTASH_REDIS_REST_URL, token: environment.UPSTASH_REDIS_REST_TOKEN },
    { url: environment.KV_REST_API_URL, token: environment.KV_REST_API_TOKEN }
  ];
  const credentials = credentialPairs.find(({ url, token }) => url && token);
  const partiallyConfigured = credentialPairs.some(({ url, token }) => Boolean(url) !== Boolean(token));
  if (!credentials && partiallyConfigured) {
    throw new Error("Set a complete Redis REST credential pair: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, or KV_REST_API_URL and KV_REST_API_TOKEN.");
  }
  const { url, token } = credentials ?? {};
  if (url && token) return new RedisRoomStore(redis ?? new Redis({ url, token }), { now });
  if (environment.VERCEL) {
    throw new Error("Vercel room persistence requires Redis REST URL and write-token environment variables.");
  }
  return new MemoryRoomStore({ now });
}
