<template>
  <view-layout
    title="Edit password"
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
          type="text"
          required
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
          required
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
      @click="save"
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
      submitted: false,
    };
  },
  methods: {
    save() {
      this.submitted = true;

      if (!this.$refs.form.checkValidity()) {
        return;
      }

      this.changePassword({
        from: this.editablePassword,
        to: { name: this.name, password: this.password },
      });
    },
    ...mapActions([actionTypes.cancelEditPassword, actionTypes.changePassword]),
  },
};
</script>
