const { createLocalStorage } = require('cloudpas-utils')
const { DbStorage } = require('./db-storage')

const localStorage = createLocalStorage('__cloudpas-services_')
const DB_KEY = 'DB'

class LocalDbStorage extends DbStorage {
  async loadDb () {
    return localStorage.get(DB_KEY)
  }

  async saveDb (db) {
    return localStorage.set(DB_KEY, db)
  }
}

module.exports = LocalDbStorage
