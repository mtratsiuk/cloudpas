function copyToClipboard (text) {
  const fakeElement = document.createElement('input')
  fakeElement.style.position = 'absolute'
  fakeElement.style.left = '-9999px'
  fakeElement.setAttribute('readonly', '')
  fakeElement.value = text

  document.body.appendChild(fakeElement)

  let success = false

  fakeElement.select()
  fakeElement.setSelectionRange(0, fakeElement.value.length)

  try {
    success =
      document.execCommand('copy') && document.queryCommandEnabled('copy')
  } catch (error) {
    success = false
  }

  fakeElement.remove()

  return success
}

module.exports = {
  copyToClipboard
}
