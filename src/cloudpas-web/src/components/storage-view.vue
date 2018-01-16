<template>
  <view-layout
    title="Choose storage"
  >
    <b-form novalidate ref="form" :validated="submitted">
      <b-form-group
        vertical
        :label-cols="4"
        label="Storage type:"
        label-for="type"
      >
        <b-form-select
          id="type"
          v-model="selected"
          :options="options"
        >
        </b-form-select>
      </b-form-group>

      <div v-if="isDropboxStorage">
        <b-form-group
          vertical
          :label-cols="4"
          label="Dropbox access token:"
          description="You can get token here: https://www.dropbox.com/developers/apps/"
          label-for="token"
        >
          <b-form-input
            id="token"
            v-model="accessToken"
            type="password"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-checkbox v-model="useLocalStorage">
          Save params in local storage
        </b-form-checkbox>
      </div>
    </b-form>
    <b-button
      slot="header-actions"
      variant="primary"
      @click="selectStorage"
    >
      Go
    </b-button>
  </view-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { actionTypes, storageTypes, getterTypes } from '@/consts';

import ViewLayout from '@/components/view-layout';

export default {
  components: { ViewLayout },
  data() {
    const storageParams = this.$store.getters[getterTypes.storageParams];

    return {
      submitted: false,

      selected: this.$store.getters[getterTypes.storageType],

      options: Object.entries(storageTypes).map(([key, value]) => ({
        text: key,
        value,
      })),

      useLocalStorage: Boolean(storageParams),

      accessToken: (storageParams && storageParams.accessToken) || '',
    };
  },
  computed: {
    isDropboxStorage() {
      return this.selected === storageTypes.dropbox;
    },
  },
  methods: {
    selectStorage() {
      this.submitted = true;

      if (!this.$refs.form.checkValidity()) {
        return;
      }

      this.$store.dispatch(actionTypes.selectStorage, {
        type: this.selected,
        params: {
          accessToken: this.accessToken,
        },
        useLocalStorage: this.useLocalStorage,
      });
    },
  },
};
</script>
