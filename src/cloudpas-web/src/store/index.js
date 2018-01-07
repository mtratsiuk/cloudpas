import Vue from 'vue'
import Vuex from 'vuex'
import { CryptoWeb, DbStorage } from 'cloudpas-services'
import { loggerify } from 'cloudpas-utils'

import localStorage from '@/utils/local-storage'
import { actionTypes, mutationTypes, getterTypes, storageTypes } from '@/consts'

const Crypto = __DEV__ ? loggerify()(CryptoWeb) : CryptoWeb

Vue.use(Vuex)

const USER_SECRETS_KEY = 'USER_SECRETS'
const STORAGE_PARAMS_KEY = 'STORAGE_PARAMS'

let storage

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
    editablePassword: null
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
    },

    [mutationTypes.removePassword] (state, { name }) {
      Vue.delete(state.db.passwords, name)
    },

    [mutationTypes.setEditablePassword] (state, password) {
      state.editablePassword = password
    }
  },

  actions: {
    async [actionTypes.setUserSecrets] (
      { commit },
      { name, password, useLocalStorage }
    ) {
      const secrets = { name, password }
      const key = await Crypto.deriveKey(password, name)

      if (useLocalStorage) {
        localStorage.set(USER_SECRETS_KEY, secrets)
      }

      commit(mutationTypes.setUserSecrets, { key, ...secrets })
    },

    async [actionTypes.selectStorage] ({ commit, getters }, { type, params }) {
      const storageMap = {
        [storageTypes.local]: DbStorage.Local
      }

      storage = new storageMap[type](params)

      await storage.init() // TODO: error handling

      const encryptedDb = await storage.loadDb()

      const key = getters[getterTypes.encryptionKey]
      let db

      if (!encryptedDb) {
        db = getInitialDb()
      } else {
        db = JSON.parse(await Crypto.decrypt(encryptedDb, key))
      }

      localStorage.set(STORAGE_PARAMS_KEY, { type, params })

      commit(mutationTypes.setStorage, { type, params })
      commit(mutationTypes.setDb, db)
    },

    async [actionTypes.saveDb] ({ getters }) {
      const key = getters[getterTypes.encryptionKey]
      const db = getters[getterTypes.db]
      const encryptedDb = await Crypto.encrypt(JSON.stringify(db), key)

      await storage.saveDb(encryptedDb)
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
    }
  }
})
