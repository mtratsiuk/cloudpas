const Dropbox = require('dropbox')
const { blobToString } = require('cloudpas-utils')

const { DbStorage } = require('./db-storage')

const DB_PATH = '/db'

class DropboxDbStorage extends DbStorage {
  constructor ({ accessToken }) {
    super()
    this._dbx = new Dropbox({ accessToken })
  }

  async loadDb () {
    try {
      const { fileBlob } = await this._dbx.filesDownload({ path: DB_PATH })
      return blobToString(fileBlob)
    } catch (error) {
      if (error.status === 409) {
        // Path not found, create new db
        // TODO: check path in #init method
        return null
      }

      throw error
    }
  }

  async saveDb (db) {
    return this._dbx.filesUpload({
      path: DB_PATH,
      contents: db,
      mode: { '.tag': 'overwrite' }
    })
  }
}

module.exports = DropboxDbStorage
