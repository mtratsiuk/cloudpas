function createLocalStorage (prefix) {
  let memoryStorage = Object.create(null)

  const storage = (window && window.localStorage) || {
    getItem (key) {
      return memoryStorage[key]
    },

    setItem (key, value) {
      memoryStorage[key] = value
    },

    removeItem (key) {
      return delete memoryStorage[key]
    },

    clear () {
      memoryStorage = Object.create(null)
    }
  }

  function _getKey (key) {
    return prefix + key
  }

  return {
    get (key) {
      try {
        return JSON.parse(storage.getItem(_getKey(key)))
      } catch (error) {
        return null
      }
    },

    set (key, value) {
      return storage.setItem(_getKey(key), JSON.stringify(value))
    },

    remove (key) {
      return storage.removeItem(_getKey(key))
    },

    clear () {
      return storage.clear()
    }
  }
}

module.exports = {
  createLocalStorage
}
