<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户账号:{{name}}</div>
    <div class="dashboard-text">用户角色:<span v-for='role in roles' :key='role'> {{role}}</span></div>
    <div class="dashboard-text">管理员用户</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px;
  }
  &-text {
    font-size: 20px;
    line-height: 35px;
    color: #606266;
  }
}
</style>