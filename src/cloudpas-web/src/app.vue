<template>
  <div id="app">
    <header class="app-header">
      <b-navbar type="dark" variant="dark">
        <b-navbar-brand href="#">Cloud Password</b-navbar-brand>
      </b-navbar>
    </header>
    <main>
      <transition name="view-fade" mode="out-in">
        <component :is="currentView"></component>
      </transition>
    </main>
  </div>
</template>

<script>
import { getterTypes } from '@/consts';

import SecretsView from '@/components/secrets-view';
import StorageView from '@/components/storage-view';
import PasswordsView from '@/components/passwords-view';
import PasswordEditView from '@/components/password-edit-view';

export default {
  components: { SecretsView, StorageView, PasswordsView, PasswordEditView },
  computed: {
    currentView() {
      if (!this.$store.getters[getterTypes.encryptionKey]) {
        return 'secrets-view';
      } else if (!this.$store.getters[getterTypes.db]) {
        return 'storage-view';
      } else if (this.$store.getters[getterTypes.editablePassword]) {
        return 'password-edit-view';
      }
      return 'passwords-view';
    },
  },
};
</script>

<style lang="less">
@import '~bootstrap/dist/css/bootstrap.css';
@import '~bootstrap-vue/dist/bootstrap-vue.css';

html,
body,
#app {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;

  > main {
    height: 1px;
    flex-grow: 1;
  }
}

.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.view-fade-enter,
.view-fade-leave-to {
  opacity: 0;
}
</style>
