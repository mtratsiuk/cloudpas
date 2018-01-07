<template>
  <view-layout
    title="Edit password"
  >
    <b-form novalidate>
      <b-form-group
        vertical
        :label-cols="4"
        label="Name:"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="name"
          type="text"
        >
        </b-form-input>
      </b-form-group>
      <b-form-group
        vertical
        :label-cols="4"
        label="Password:"
        label-for="password"
      >
        <b-form-input
          id="password"
          v-model="password"
          type="password"
        >
        </b-form-input>
      </b-form-group>
    </b-form>
    <b-button
      slot="header-actions"
      variant="warning"
      @click="cancelEditPassword"
    >
      Cancel
    </b-button>
    <b-button
      slot="header-actions"
      variant="success"
      @click="changePassword({ from: editablePassword, to: { name, password } })"
    >
      Save
    </b-button>
  </view-layout>
</template>

<script>
import { mapActions } from 'vuex';
import ViewLayout from '@/components/view-layout';
import { actionTypes, getterTypes } from '@/consts';

export default {
  components: { ViewLayout },
  data() {
    const editablePassword = this.$store.getters[getterTypes.editablePassword];

    return {
      name: editablePassword.name,
      password: editablePassword.password,
      editablePassword,
    };
  },
  methods: {
    ...mapActions([actionTypes.cancelEditPassword, actionTypes.changePassword]),
  },
};
</script>
