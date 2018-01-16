export const actionTypes = {
  setUserSecrets: 'setUserSecrets',
  selectStorage: 'selectStorage',
  saveDb: 'saveDb',
  clearData: 'clearData',
  addPassword: 'addPassword',
  changePassword: 'changePassword',
  removePassword: 'removePassword',
  editPassword: 'editPassword',
  cancelEditPassword: 'cancelEditPassword',
  revertChanges: 'revertChanges'
}

export const mutationTypes = {
  setUserSecrets: 'setUserSecrets',
  setStorage: 'setStorage',
  setDb: 'setDb',
  clearData: 'clearData',
  addPassword: 'addPassword',
  removePassword: 'removePassword',
  setEditablePassword: 'setEditablePassword',
  setIsDirty: 'setIsDirty'
}

export const getterTypes = {
  userName: 'userName',
  userPassword: 'userPassword',
  encryptionKey: 'encryptionKey',
  storageType: 'storageType',
  storageParams: 'storageParams',
  db: 'db',
  passwords: 'passwords',
  editablePassword: 'editablePassword',
  isDirty: 'isDirty'
}

export const storageTypes = {
  local: 'local',
  dropbox: 'dropbox'
}
