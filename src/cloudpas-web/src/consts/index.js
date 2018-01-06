export const actionTypes = {
  setUserSecrets: 'setUserSecrets',
  selectStorage: 'selectStorage',
  clearData: 'clearData'
}

export const mutationTypes = {
  setUserSecrets: 'setUserSecrets',
  setStorage: 'setStorage',
  setDb: 'setDb',
  clearData: 'clearData'
}

export const getters = {
  userName: 'userName',
  userPassword: 'userPassword',
  encryptionKey: 'encryptionKey',
  storageType: 'storageType',
  db: 'db'
}

export const storageTypes = {
  local: 'local',
  dropbox: 'dropbox'
}
