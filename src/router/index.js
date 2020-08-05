import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: (resolve) => require(['../view/user/user-modify'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['../view/longin'], resolve)
    },
    {
      path:'/question/add',
      name: 'addQuestion',
      component: (resolve) => require(['../view/question/add-question'], resolve)
    },
    {
      path:'/',
      name: 'Questionlist',
      component: (resolve) => require(['../view/question/question-list'], resolve)
    },
    {
      path:'/question/modify/:id',
      name: 'questionModify',
      component: (resolve) => require(['../view/question/modify-question'], resolve)
    },
    {
      path:'/user/list',
      name:'userList',
      component: (resolve) => require(['../view/user/user-list'], resolve)
    },
    {
      path:'/paper/list',
      name:'paperList',
      component: (resolve) => require(['../view/paper/paper-list'], resolve)
    },
    {
      path:'/paper/modifyDetail',
      name: 'paperModifyDetail',
      component: (resolve) => require(['../view/paper/paper-modify-detail'], resolve)
    },
    {
      path: '/paper/message',
      name: 'paperMessage',
      component: (resolve) => require(['../view/paper/paper-manual-create'], resolve)
    },
    {
      path: '/paper/detail',
      name: 'paperDetail',
      component: (resolve) => require(['../view/paper/paper-detail'], resolve)
    },
    {
      path: '/paper/auto',
      name: 'paperAuto',
      component: (resolve) => require(['../view/paper/paper-auto-create'], resolve)
    },
  ]
})
