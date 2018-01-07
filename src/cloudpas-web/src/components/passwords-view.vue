<template>
  <view-layout
    title="Passwords"
  >

  <div class="passwords-container">
    <b-form-input
      v-model="filter"
      type="text"
      placeholder="Search password"
      class="filter"
      @focus.native="$event.target.select()"
    />
    <b-list-group class="passwords-list">
      <b-list-group-item
        href="#"
        v-for="password in filteredPasswords"
        :key="password.name"
        @click="editPassword(password)"
      >
        <div class="password-item">
          <div class="password-item__name">{{password.name}}</div>
          <div
            v-b-tooltip.hover
            title="Show"
            @click.stop="$event.target.type = 'text'"
          >
            <b-form-input
              :value="password.password"
              class="password-item__password d-none d-md-block"
              type="password"
              @click.native="$event.target.select()"
              readonly
            />
          </div>
          <b-button
            variant="danger"
            size="sm"
            @click.stop="removePassword(password)"
          >
            Remove
          </b-button>
          <b-button
            variant="primary"
            size="sm"
            @click.stop="copy(password)"
          >
            Copy
          </b-button>
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-button
      block
      class="mx-auto add-password-btn"
      variant="primary"
      size="lg"
      @click="addPassword"
    >
      Add password
    </b-button>
  </div>

  <b-button
    slot="header-actions"
    variant="success"
    @click="saveDb"
  >
    Save changes
  </b-button>
  </view-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { copyToClipboard } from 'cloudpas-utils';

import { getterTypes, actionTypes } from '@/consts';
import ViewLayout from '@/components/view-layout';

export default {
  components: { ViewLayout },
  data() {
    return {
      filter: '',
    };
  },
  computed: {
    filteredPasswords() {
      return this.passwords.filter(
        ({ name }) =>
          name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      );
    },
    ...mapGetters([getterTypes.passwords]),
  },
  methods: {
    copy({ password }) {
      copyToClipboard(password);
    },
    ...mapActions([
      actionTypes.addPassword,
      actionTypes.saveDb,
      actionTypes.removePassword,
      actionTypes.editPassword,
    ]),
  },
};
</script>

<style lang="less" scoped>
.passwords-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  > :not(.passwords-list) {
    flex-shrink: 0;
  }
}

.filter {
  margin-bottom: 25px;
}

.passwords-list {
  flex-grow: 2;
  overflow-y: scroll;
  margin-bottom: 25px;
}

.password-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__name {
    flex-basis: 40%;
    margin-right: 10px;
  }

  &__password {
    width: 150px;
  }
}

.add-password-btn {
  max-width: 300px;
}
</style>
