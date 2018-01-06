import Vue from 'vue'
import Vuex from 'vuex'
import { CryptoWeb, DbStorage } from 'cloudpas-services'

import localStorage from '@/utils/local-storage'
import { actionTypes, mutationTypes, getters, storageTypes } from '@/consts'

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
    db: null
  }
}

function getInitialDb () {
  return {
    version: 1,
    passwords: []
  }
}

export default new Vuex.Store({
  state: getInitialState(),

  getters: {
    [getters.userName] (state) {
      return state.userSecrets.name
    },
    [getters.userPassword] (state) {
      return state.userSecrets.password
    },
    [getters.encryptionKey] (state) {
      return state.userSecrets.key
    },
    [getters.storageType] (state) {
      return state.storage.type
    },
    [getters.db] (state) {
      return state.db
    }
  },

  mutations: {
    [mutationTypes.setUserSecrets] (state, { name, password, key }) {
      state.userSecrets = { name, password, key }
    },

    [mutationTypes.setStorage] (state, { type, params }) {
      state.storage = { type, params }
    },

    [mutationTypes.setDb] (state, db) {
      state.db = db
    },

    [mutationTypes.clearData] (state) {
      state = getInitialState()
    }
  },

  actions: {
    async [actionTypes.setUserSecrets] (
      { commit },
      { name, password, useLocalStorage }
    ) {
      const secrets = { name, password }
      const key = await CryptoWeb.deriveKey(password, name)

      if (useLocalStorage) {
        localStorage.set(USER_SECRETS_KEY, secrets)
      }

      commit(mutationTypes.setUserSecrets, { key, ...secrets })
    },

    async [actionTypes.selectStorage] ({ commit }, { type, params }) {
      const storageMap = {
        [storageTypes.local]: DbStorage.Local
      }

      storage = new storageMap[type](params)
      await storage.init() // TODO: error handling
      const db = (await storage.loadDb()) || getInitialDb()

      localStorage.set(STORAGE_PARAMS_KEY, { type, params })

      commit(mutationTypes.setStorage, storage)
      commit(mutationTypes.setDb, db)
    },

    [actionTypes.clearData] ({ commit }) {
      localStorage.remove(USER_SECRETS_KEY)
      localStorage.remove(STORAGE_PARAMS_KEY)

      commit(mutationTypes.clearData)
    }
  }
})
