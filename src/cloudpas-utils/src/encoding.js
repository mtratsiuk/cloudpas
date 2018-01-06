function toArrayBuffer (str, enc = 'utf8') {
  return Buffer.from(str, enc).buffer
}

function fromArrayBuffer (buf, enc = 'utf8') {
  return Buffer.from(buf).toString(enc)
}

module.exports = {
  toArrayBuffer,
  fromArrayBuffer
}
