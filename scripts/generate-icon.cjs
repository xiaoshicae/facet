// 生成 1024x1024 占位图标（蓝紫渐变 + "F" 字形）。
// 这是占位资源；发布前用 `npx @tauri-apps/cli icon path/to/logo.png` 替换为正式 logo。
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

const SIZE = 1024
const crcTable = (() => {
  const t = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

// 简易 5x7 点阵 "F"
const F = ['11111', '10000', '10000', '11110', '10000', '10000', '10000']

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1))
let p = 0
for (let y = 0; y < SIZE; y++) {
  raw[p++] = 0 // filter: none
  for (let x = 0; x < SIZE; x++) {
    const t = (x + y) / (2 * SIZE) // 对角渐变 0..1
    // 蓝(#3b6ad8) → 紫(#7c4dd8)
    let r = Math.round(0x3b + (0x7c - 0x3b) * t)
    let g = Math.round(0x6a + (0x4d - 0x6a) * t)
    let b = Math.round(0xd8 + (0xd8 - 0xd8) * t)
    // 居中绘制 "F"
    const cell = SIZE / 9
    const gx = Math.floor((x - cell * 2) / cell)
    const gy = Math.floor((y - cell) / cell)
    if (gx >= 0 && gx < 5 && gy >= 0 && gy < 7 && F[gy][gx] === '1') {
      r = g = b = 0xf5
    }
    raw[p++] = r
    raw[p++] = g
    raw[p++] = b
    raw[p++] = 0xff
  }
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0)
ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // color type RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])
const out = path.join(__dirname, '..', 'app-icon.png')
fs.writeFileSync(out, png)
console.log('wrote', out, png.length, 'bytes')
