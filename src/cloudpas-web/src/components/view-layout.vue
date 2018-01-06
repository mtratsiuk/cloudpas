<template>
  <b-container>
    <b-card bg-variant="light">

      <b-row class="header" align-h="between">
        <div><h3>{{title}}</h3></div>
        <div>
          <slot name="header-actions"></slot>
        </div>
      </b-row>

      <b-row>
        <b-container>
          <slot></slot>
        </b-container>
      </b-row>

    </b-card>
  </b-container>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 20px;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
