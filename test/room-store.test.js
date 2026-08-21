import test from "node:test";
import assert from "node:assert/strict";
import { createRoomStore, MemoryRoomStore, RedisRoomStore, roomLifetimeMilliseconds } from "../src/room-store.js";

class FakeRedis {
  constructor() {
    this.values = new Map();
    this.setOptions = [];
  }

  async set(key, value, options = {}) {
    this.setOptions.push({ key, options });
    if (options.nx && this.values.has(key)) return null;
    this.values.set(key, structuredClone(value));
    return "OK";
  }

  async get(key) {
    const value = this.values.get(key);
    return value === undefined ? null : structuredClone(value);
  }

  async del(key) {
    return this.values.delete(key) ? 1 : 0;
  }

  async eval(_script, keys, arguments_) {
    const [key] = keys;
    if (this.values.get(key) !== arguments_[0]) return 0;
    this.values.delete(key);
    return 1;
  }
}

function room(lastSeenAt = 1_000) {
  return { lastSeenAt, game: { revision: 0 } };
}

test("local room storage remains available without production credentials", async () => {
  const store = createRoomStore({ environment: {}, now: () => 2_000 });

  assert.equal(store.kind, "memory");
  assert.equal(await store.create("abc123", room()), true);
  assert.equal(await store.create("ABC123", room()), false);
  await store.update("ABC123", (storedRoom) => {
    storedRoom.game.revision += 1;
  });

  assert.deepEqual(await store.get("abc123"), { lastSeenAt: 2_000, game: { revision: 1 } });
});

test("memory room updates are discarded when validation fails", async () => {
  const store = new MemoryRoomStore();
  await store.create("ABC123", room());

  await assert.rejects(store.update("ABC123", (storedRoom) => {
    storedRoom.game.revision = 99;
    throw new Error("invalid move");
  }), /invalid move/);

  assert.equal((await store.get("ABC123")).game.revision, 0);
});

test("inactive memory rooms expire after twelve hours", async () => {
  let now = roomLifetimeMilliseconds;
  const store = new MemoryRoomStore({ now: () => now });
  await store.create("ABC123", room(0));
  store.cleanupExpired();
  assert.ok(await store.get("ABC123"));

  now += 1;
  store.cleanupExpired();
  assert.equal(await store.get("ABC123"), null);
});

test("Redis rooms are shared across independent server instances", async () => {
  const redis = new FakeRedis();
  const firstInstance = new RedisRoomStore(redis, { now: () => 2_000 });
  const secondInstance = new RedisRoomStore(redis, { now: () => 3_000 });

  assert.equal(await firstInstance.create("ABC123", room()), true);
  assert.equal(await secondInstance.create("ABC123", room()), false);
  await secondInstance.update("ABC123", (storedRoom) => {
    storedRoom.game.revision += 1;
  });

  assert.deepEqual(await firstInstance.get("ABC123"), { lastSeenAt: 3_000, game: { revision: 1 } });
  assert.ok(redis.setOptions.some(({ options }) => options.ex === 43_200));
  await firstInstance.remove("ABC123");
  assert.equal(await secondInstance.get("ABC123"), null);
});

test("Redis serializes simultaneous room mutations", async () => {
  const redis = new FakeRedis();
  const firstInstance = new RedisRoomStore(redis);
  const secondInstance = new RedisRoomStore(redis);
  await firstInstance.create("ABC123", room());

  await Promise.all([
    firstInstance.update("ABC123", async (storedRoom) => {
      const revision = storedRoom.game.revision;
      await new Promise((resolve) => setTimeout(resolve, 20));
      storedRoom.game.revision = revision + 1;
    }),
    secondInstance.update("ABC123", (storedRoom) => {
      storedRoom.game.revision += 1;
    })
  ]);

  assert.equal((await firstInstance.get("ABC123")).game.revision, 2);
});

test("Vercel fails fast instead of using disposable memory", () => {
  assert.throws(
    () => createRoomStore({ environment: { VERCEL: "1" } }),
    /Vercel room persistence requires/
  );
  assert.throws(
    () => createRoomStore({ environment: { UPSTASH_REDIS_REST_URL: "https:\/\/example.test" } }),
    /Set a complete Redis REST credential pair/
  );
});

test("Vercel accepts both current Upstash and Vercel KV credential names", () => {
  const redis = new FakeRedis();
  const currentNames = createRoomStore({
    environment: {
      VERCEL: "1",
      UPSTASH_REDIS_REST_URL: "https://example.test",
      UPSTASH_REDIS_REST_TOKEN: "write-token"
    },
    redis
  });
  const kvNames = createRoomStore({
    environment: {
      VERCEL: "1",
      KV_REST_API_URL: "https://example.test",
      KV_REST_API_TOKEN: "write-token",
      KV_REST_API_READ_ONLY_TOKEN: "read-only-token"
    },
    redis
  });

  assert.equal(currentNames.kind, "redis");
  assert.equal(kvNames.kind, "redis");
});
