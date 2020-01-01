<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <!-- <sidebar-item :routes="routes"></sidebar-item>
      <sidebar-item :routes="addRouters"></sidebar-item> -->
      <sidebar-item :routes="treeData"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { GetMenu } from '@/api/menu'

export default {
  components: SidebarItem,
  data() {
    return {
      treeData: [],
      routesList: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'addRouters'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      GetMenu(this.listQuery).then(response => {
        var res = response.data
        for (var i = 0; i < res.length; i++) {
          var obj = {
            path: res[i].path,
            component: 'Layout',
            redirect: res[i].redirect,
            name: res[i].name,
            meta: { title: res[i].name, icon: 'table' }
          }
          obj.children = []
          if (res[i].children.length > 0) {
            for (var j = 0; j < res[i].children.length; j++) {
              var path = '@/' + res[i].children[j].component
              var obj1 = {
                path: res[i].children[j].path,
                component: () => import(path),
                name: res[i].children[j].name,
                meta: { title: res[i].children[j].name, icon: res[i].children[j].icon, roles: ['admin'] }
              }
              obj.children.push(obj1)
            }
          }
          this.treeData.push(obj)
        }
      })
    }
  }
}
</script>
