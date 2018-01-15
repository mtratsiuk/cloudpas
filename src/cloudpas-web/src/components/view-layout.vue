<template>
  <b-container class="card-container">
    <b-card bg-variant="light" class="card">

      <b-row class="header" align-h="between">
        <div><h3>{{title}}</h3></div>
        <div class="header-actions">
          <slot name="header-actions"></slot>
        </div>
      </b-row>

      <b-row class="card-body-slot">
        <b-col>
          <slot></slot>
        </b-col>
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

.card-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  max-width: 800px;
  max-height: 650px;
  height: 45vh;
  width: 80vw;

  @media (max-width: 767.99px) {
    height: ~'calc(99vh - 56px)';
    width: ~'calc(99vw)';
  }

  > * {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.card-body-slot {
  height: 1px;
  flex-grow: 1;

  > * {
    height: 100%;
  }
}

.header-actions {
  > :not(:last-child) {
    margin-right: 1rem;
  }
}
</style>
