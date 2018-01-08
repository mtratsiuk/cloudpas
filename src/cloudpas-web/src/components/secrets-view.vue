<template>
  <view-layout
    title="Enter your secrets"
  >
    <b-form novalidate ref="form" :validated="submitted">
      <b-form-group
        vertical
        :label-cols="4"
        label="Name:"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="name"
          type="password"
          required
        >
        </b-form-input>
      </b-form-group>
      <b-form-group
        vertical
        :label-cols="4"
        label="Master Password:"
        label-for="password"
      >
        <b-form-input
          id="password"
          v-model="password"
          type="password"
          required
        >
        </b-form-input>
      </b-form-group>
      <b-form-checkbox v-model="useLocalStorage">
        Save in local storage (better don't)
      </b-form-checkbox>
    </b-form>
    <b-button
      slot="header-actions"
      variant="primary"
      @click="setSecrets"
    >
      Go
    </b-button>
  </view-layout>
</template>

<script>
import ViewLayout from '@/components/view-layout';
import { actionTypes, getterTypes } from '@/consts';

export default {
  components: { ViewLayout },
  data() {
    return {
      name: this.$store.getters[getterTypes.userName],
      password: this.$store.getters[getterTypes.userPassword],
      useLocalStorage: false,
      submitted: false,
    };
  },
  methods: {
    setSecrets() {
      this.submitted = true;

      if (!this.$refs.form.checkValidity()) {
        return;
      }

      this.$store.dispatch(actionTypes.setUserSecrets, {
        name: this.name,
        password: this.password,
        useLocalStorage: this.useLocalStorage,
      });
    },
  },
};
</script>
