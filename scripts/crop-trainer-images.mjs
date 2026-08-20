import { readFileSync, writeFileSync } from "node:fs";
import { deflateSync, inflateSync } from "node:zlib";

const sourcePath = new URL("../public/assets/trainers/original-trainer-tiles.png", import.meta.url);
const source = readFileSync(sourcePath);
const signature = source.subarray(0, 8);
const chunks = [];

for (let offset = 8; offset < source.length;) {
  const length = source.readUInt32BE(offset);
  const type = source.toString("ascii", offset + 4, offset + 8);
  chunks.push({ type, data: source.subarray(offset + 8, offset + 8 + length) });
  offset += 12 + length;
}

const ihdr = chunks.find(({ type }) => type === "IHDR").data;
const width = ihdr.readUInt32BE(0);
const height = ihdr.readUInt32BE(4);
const bitDepth = ihdr[8];
const colorType = ihdr[9];

if (bitDepth !== 8 || colorType !== 2) {
  throw new Error(`Expected an 8-bit RGB PNG; received bit depth ${bitDepth}, color type ${colorType}.`);
}

const bytesPerPixel = 3;
const stride = width * bytesPerPixel;
const compressed = Buffer.concat(chunks.filter(({ type }) => type === "IDAT").map(({ data }) => data));
const filtered = inflateSync(compressed);
const pixels = Buffer.alloc(stride * height);

const paeth = (left, above, upperLeft) => {
  const estimate = left + above - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const aboveDistance = Math.abs(estimate - above);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  return leftDistance <= aboveDistance && leftDistance <= upperLeftDistance
    ? left
    : aboveDistance <= upperLeftDistance ? above : upperLeft;
};

for (let y = 0; y < height; y += 1) {
  const filter = filtered[y * (stride + 1)];
  const rowStart = y * stride;
  const filteredStart = y * (stride + 1) + 1;

  for (let x = 0; x < stride; x += 1) {
    const value = filtered[filteredStart + x];
    const left = x >= bytesPerPixel ? pixels[rowStart + x - bytesPerPixel] : 0;
    const above = y > 0 ? pixels[rowStart + x - stride] : 0;
    const upperLeft = y > 0 && x >= bytesPerPixel ? pixels[rowStart + x - stride - bytesPerPixel] : 0;
    const reconstructed = filter === 0 ? value
      : filter === 1 ? value + left
      : filter === 2 ? value + above
      : filter === 3 ? value + Math.floor((left + above) / 2)
      : filter === 4 ? value + paeth(left, above, upperLeft)
      : Number.NaN;

    if (Number.isNaN(reconstructed)) throw new Error(`Unsupported PNG filter ${filter}.`);
    pixels[rowStart + x] = reconstructed & 0xff;
  }
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const makeChunk = (type, data) => {
  const typeBytes = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBytes, data]);
  let crc = 0xffffffff;
  for (const byte of body) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  crc = (crc ^ 0xffffffff) >>> 0;
  const result = Buffer.alloc(12 + data.length);
  result.writeUInt32BE(data.length, 0);
  typeBytes.copy(result, 4);
  data.copy(result, 8);
  result.writeUInt32BE(crc, 8 + data.length);
  return result;
};

const crops = [
  { name: "ash", x: 52, y: 27, width: 224, height: 325 },
  { name: "brock", x: 282, y: 31, width: 218, height: 318 },
  { name: "misty", x: 502, y: 40, width: 221, height: 314 },
  { name: "team-rocket", x: 725, y: 32, width: 220, height: 322 },
];

for (const crop of crops) {
  const raw = Buffer.alloc((crop.width * bytesPerPixel + 1) * crop.height);
  const cropStride = crop.width * bytesPerPixel;
  for (let y = 0; y < crop.height; y += 1) {
    const targetStart = y * (cropStride + 1);
    raw[targetStart] = 0;
    pixels.copy(
      raw,
      targetStart + 1,
      (crop.y + y) * stride + crop.x * bytesPerPixel,
      (crop.y + y) * stride + (crop.x + crop.width) * bytesPerPixel,
    );
  }

  const cropHeader = Buffer.from(ihdr);
  cropHeader.writeUInt32BE(crop.width, 0);
  cropHeader.writeUInt32BE(crop.height, 4);
  const output = Buffer.concat([
    signature,
    makeChunk("IHDR", cropHeader),
    makeChunk("IDAT", deflateSync(raw, { level: 9 })),
    makeChunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(new URL(`../public/assets/trainers/${crop.name}.png`, import.meta.url), output);
}
