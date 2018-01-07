function debug (msg, ...args) {
  console.log(`${msg}:`, ...args)
}

module.exports = {
  debug: process.env.NODE_ENV === 'development' ? debug : () => {}
}
