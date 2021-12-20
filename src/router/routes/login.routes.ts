const Login = () => import('@/views/User/Login.vue')
export default {
  path: '/login',
  name: 'Login',
  component: Login,
  meta: {
    title: 'Χαλαρό - 登录'
  },
  children: []
}
