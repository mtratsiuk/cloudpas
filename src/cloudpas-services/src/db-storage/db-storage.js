class DbStorage {
  init () {
    return Promise.resolve()
  }

  loadDb () {
    throw new Error('Not implemented')
  }

  saveDb () {
    throw new Error('Not implemented')
  }
}

module.exports = {
  DbStorage
}
