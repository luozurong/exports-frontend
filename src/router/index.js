import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
   title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'example' }
    }]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/info',
    name: 'account',
    meta: { title: '账户信息管理', icon: 'example' },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/user/info'),
        meta: { title: '修改信息', icon: 'example' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'example' }
      }
    ]
  },
  {
    path: '/exports',
    component: Layout,
    redirect: '/exports/company',
    name: 'exports',
    meta: { title: '导出管理', icon: 'example' },
    children: [
      {
        path: 'company',
        name: 'Company',
        component: () => import('@/views/exports/company'),
        meta: { title: '药企档案', icon: 'example' }
      },
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('@/views/exports/shop'),
        meta: { title: '药店档案', icon: 'table' }
      },
      {
        path: 'doctor',
        name: 'Doctor',
        component: () => import('@/views/exports/doctor'),
        meta: { title: '医师档案', icon: 'table' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
    // 后端支持可开 history
    mode: 'history',
    base: 'exports',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

// 异步挂载的路由,动态需要根据权限加载的路由表
export const asyncRouterMap = [{
        path: '/log',
        component: Layout,
        redirect: '/log/index',
        children: [{
            path: 'index',
            component: () =>
                import ('@/views/log/index'),
            name: '测试admin',
            meta: { title: 'admin', icon: 'table', roles: ['admin'] }
        }]
    },
    { path: '*', redirect: '/404', hidden: true }
]
