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
import { actionTypes, storageTypes, getterTypes } from '@/consts';

import ViewLayout from '@/components/view-layout';

export default {
  components: { ViewLayout },
  data() {
    return {
      submitted: false,
      selected: this.$store.getters[getterTypes.storageType],
      options: Object.entries(storageTypes).map(([key, value]) => ({
        text: key,
        value,
      })),
    };
  },
  methods: {
    selectStorage() {
      this.submitted = true;

      if (!this.$refs.form.checkValidity()) {
        return;
      }

      this.$store.dispatch(actionTypes.selectStorage, {
        type: this.selected,
      });
    },
  },
};
</script>
