// import axios from 'axios'
import { createRouter, createWebHistory } from "vue-router";
let routeList = [];
function importAll(r) {
  r.keys().forEach((key) => routeList.push(r(key).default));
}
importAll(require.context("./", true, /\.router\.js/));
console.log(routeList);
// import Login from '../components/Login'
const Login = () =>
  import(/* webpackChunkName:"login_home_welcome" */ "../components/Login");
// import Home from '../components/Home'
const Home = () =>
  import(/* webpackChunkName:"login_home_welcome" */ "../components/Home");
// import Welcome from '../components/Welcome'
// const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome')
// import Users from '../components/user/Users'
// const Users = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/user/Users')
// // import Rights from '../components/rights/Rights'
// const Rights = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/rights/Rights')
// // import Roles from '../components/rights/Roles'
// const Roles = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/rights/Roles')

// // import Cates from '../components/goods/Cate'
// const Cates = () => import(/* webpackChunkName:"cates_params" */ '../components/goods/Cate')
// // import Params from '../components/goods/Params'
// const Params = () => import(/* webpackChunkName:"cates_params" */ '../components/goods/Params')

// // import Goods from '../components/goods/List'
// const Goods = () => import(/* webpackChunkName:"Goods_Add" */ '../components/goods/List')
// // import Add from '../components/goods/Add'
// const Add = () => import(/* webpackChunkName:"Goods_Add" */ '../components/goods/Add')

// // import Order from '../components/order/Order'
// const Order = () => import(/* webpackChunkName:"Order_Report" */ '../components/order/Order')
// // import Report from '../components/report/Report'
// const Report = () => import(/* webpackChunkName:"Order_Report" */ '../components/report/Report')

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      //     // { path: '/welcome', component: Welcome },
      //     // { path: '/users', component: Users },
      //     // { path: '/rights', component: Rights },
      //     // { path: '/roles', component: Roles },
      //     // { path: '/categories', component: Cates },
      //     // { path: '/params', component: Params },
      //     // { path: '/goods', component: Goods },
      //     // { path: '/goods/add', component: Add },
      //     // { path: '/orders', component: Order },
      //     // { path: '/reports', component: Report }
      ...routeList,
    ],
  },
];
const router = createRouter({
  history: createWebHistory(), //路由模式
  routes,
});

router.beforeEach((to, from, next) => {
  // next() 放行 next('/login')强制跳转
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
