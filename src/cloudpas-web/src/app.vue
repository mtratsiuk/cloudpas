<template>
  <div id="app">
    <header class="app-header">
      <b-navbar type="dark" variant="dark">
        <b-navbar-brand href="#">Cloud Password</b-navbar-brand>
      </b-navbar>
    </header>
    <main>
      <component :is="currentView"></component>
    </main>
  </div>
</template>

<script>
import { getters } from '@/consts';

import SecretsView from '@/components/secrets-view';
import StorageView from '@/components/storage-view';
import PasswordsView from '@/components/passwords-view';

export default {
  components: { SecretsView, StorageView, PasswordsView },
  computed: {
    currentView() {
      if (!this.$store.getters[getters.encryptionKey]) {
        return 'secrets-view';
      } else if (!this.$store.getters[getters.db]) {
        return 'storage-view';
      }
      return 'passwords-view';
    },
  },
};
</script>

<style lang="less">
@import '~bootstrap/dist/css/bootstrap.css';
@import '~bootstrap-vue/dist/bootstrap-vue.css';

.app-header {
  margin-bottom: 50px;
}
</style>
