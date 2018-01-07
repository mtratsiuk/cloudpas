export const actionTypes = {
  setUserSecrets: 'setUserSecrets',
  selectStorage: 'selectStorage',
  saveDb: 'saveDb',
  clearData: 'clearData',
  addPassword: 'addPassword',
  changePassword: 'changePassword',
  removePassword: 'removePassword',
  editPassword: 'editPassword',
  cancelEditPassword: 'cancelEditPassword'
}

export const mutationTypes = {
  setUserSecrets: 'setUserSecrets',
  setStorage: 'setStorage',
  setDb: 'setDb',
  clearData: 'clearData',
  addPassword: 'addPassword',
  removePassword: 'removePassword',
  setEditablePassword: 'setEditablePassword'
}

export const getterTypes = {
  userName: 'userName',
  userPassword: 'userPassword',
  encryptionKey: 'encryptionKey',
  storageType: 'storageType',
  db: 'db',
  passwords: 'passwords',
  editablePassword: 'editablePassword'
}

export const storageTypes = {
  local: 'local',
  dropbox: 'dropbox'
}
