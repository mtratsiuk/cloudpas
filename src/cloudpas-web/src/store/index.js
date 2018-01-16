import Vue from 'vue'
import Vuex from 'vuex'
import { CryptoWeb, DbStorage } from 'cloudpas-services'
import { loggerify } from 'cloudpas-utils'

import localStorage from '@/utils/local-storage'
import { actionTypes, mutationTypes, getterTypes, storageTypes } from '@/consts'

const Crypto = loggerify(CryptoWeb)

Vue.use(Vuex)

const USER_SECRETS_KEY = 'USER_SECRETS'
const STORAGE_PARAMS_KEY = 'STORAGE_PARAMS'

let storage
let initialDb

function getInitialState () {
  return {
    userSecrets: {
      name: '',
      password: '',
      key: null,
      ...localStorage.get(USER_SECRETS_KEY)
    },
    storage: {
      type: storageTypes.local,
      params: null,
      ...localStorage.get(STORAGE_PARAMS_KEY)
    },
    db: null,
    editablePassword: null,
    isDirty: false
  }
}

function getInitialDb () {
  return {
    version: 1,
    passwords: {}
  }
}

export default new Vuex.Store({
  strict: __DEV__,

  state: getInitialState(),

  getters: {
    [getterTypes.userName] (state) {
      return state.userSecrets.name
    },
    [getterTypes.userPassword] (state) {
      return state.userSecrets.password
    },
    [getterTypes.encryptionKey] (state) {
      return state.userSecrets.key
    },
    [getterTypes.storageType] (state) {
      return state.storage.type
    },
    [getterTypes.storageParams] (state) {
      return state.storage.params
    },
    [getterTypes.db] (state) {
      return state.db
    },
    [getterTypes.passwords] (state) {
      return Object.entries(
        (state.db || {}).passwords || []
      ).map(([name, data]) => ({
        name,
        ...data
      }))
    },
    [getterTypes.editablePassword] (state) {
      return state.editablePassword
    },
    [getterTypes.isDirty] (state) {
      return state.isDirty
    }
  },

  mutations: {
    [mutationTypes.setUserSecrets] (state, secrets) {
      state.userSecrets = secrets
    },

    [mutationTypes.setStorage] (state, storage) {
      state.storage = storage
    },

    [mutationTypes.setDb] (state, db) {
      state.db = db
    },

    [mutationTypes.clearData] (state) {
      state = getInitialState()
    },

    [mutationTypes.addPassword] (state, { name, ...password }) {
      state.db.passwords = {
        ...state.db.passwords,
        [name]: password
      }
      state.isDirty = true
    },

    [mutationTypes.removePassword] (state, { name }) {
      Vue.delete(state.db.passwords, name)
      state.isDirty = true
    },

    [mutationTypes.setEditablePassword] (state, password) {
      state.editablePassword = password
    },

    [mutationTypes.setIsDirty] (state, value) {
      state.isDirty = value
    }
  },

  actions: {
    async [actionTypes.setUserSecrets] (
      { commit },
      { name, password, useLocalStorage }
    ) {
      const secrets = { name, password }
      const key = await Crypto.deriveKey(password, name)

      localStorage.set(USER_SECRETS_KEY, useLocalStorage ? secrets : null)

      commit(mutationTypes.setUserSecrets, { key, ...secrets })
    },

    async [actionTypes.selectStorage] (
      { commit, getters },
      { type, params, useLocalStorage }
    ) {
      const storageMap = {
        [storageTypes.local]: DbStorage.Local,
        [storageTypes.dropbox]: DbStorage.Dropbox
      }

      storage = loggerify(new storageMap[type](params))

      await storage.init() // TODO: error handling

      const encryptedDb = await storage.loadDb()

      const key = getters[getterTypes.encryptionKey]
      const db = encryptedDb
        ? JSON.parse(await Crypto.decrypt(encryptedDb, key))
        : getInitialDb()

      initialDb = JSON.stringify(db)

      localStorage.set(STORAGE_PARAMS_KEY, {
        type,
        params: useLocalStorage ? params : null
      })

      commit(mutationTypes.setStorage, { type, params })
      commit(mutationTypes.setDb, db)
    },

    async [actionTypes.saveDb] ({ commit, getters }) {
      const key = getters[getterTypes.encryptionKey]
      const db = getters[getterTypes.db]
      const encryptedDb = await Crypto.encrypt(JSON.stringify(db), key)

      await storage.saveDb(encryptedDb) // TODO: error handling

      initialDb = JSON.stringify(db)
      commit(mutationTypes.setIsDirty, false)
    },

    [actionTypes.clearData] ({ commit }) {
      localStorage.remove(USER_SECRETS_KEY)
      localStorage.remove(STORAGE_PARAMS_KEY)

      commit(mutationTypes.clearData)
    },

    [actionTypes.changePassword] ({ commit }, { from, to }) {
      commit(mutationTypes.removePassword, from)
      commit(mutationTypes.addPassword, to)
      commit(mutationTypes.setEditablePassword, null)
    },

    [actionTypes.removePassword] ({ commit }, password) {
      commit(mutationTypes.removePassword, password)
    },

    [actionTypes.addPassword] ({ commit }) {
      commit(mutationTypes.setEditablePassword, { name: '', password: '' })
    },

    [actionTypes.editPassword] ({ commit }, password) {
      commit(mutationTypes.setEditablePassword, password)
    },

    [actionTypes.cancelEditPassword] ({ commit }) {
      commit(mutationTypes.setEditablePassword, null)
    },

    [actionTypes.revertChanges] ({ commit, getters }) {
      commit(mutationTypes.setDb, JSON.parse(initialDb))
      commit(mutationTypes.setIsDirty, false)
    }
  }
})
