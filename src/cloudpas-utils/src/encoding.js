function toArrayBuffer (str, enc = 'utf8') {
  return Buffer.from(str, enc).buffer
}

function fromArrayBuffer (buf, enc = 'utf8') {
  return Buffer.from(buf).toString(enc)
}

function blobToString (blob, enc = 'utf8') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = ({ target: { result } }) => resolve(result)
    reader.onerror = reject

    reader.readAsText(blob, enc)
  })
}

module.exports = {
  toArrayBuffer,
  fromArrayBuffer,
  blobToString
}
