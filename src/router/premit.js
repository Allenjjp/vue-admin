import router from "./index"
import store from '../store/index';
import { getToken, removeToken, removeUsername } from "@/utils/app"

const whiteRouter = ['/login'] // indexOf方法，判断数组中是否存在指定的某个对象,如果不存在，则返回 -1

// 路由守卫
router.beforeEach((to, from, next) => {
    if(getToken()) {
        if(to.path === '/login') {
            removeToken();
            removeUsername();
            store.commit('app/SET_TOKEN', "");
            store.commit('app/SET_USERNAME', "");
            next();
        } else {
            next();
        }
    } else {
        if(whiteRouter.indexOf(to.path) !== -1) {
            next();
        } else {
            next("/login");
        }

        /**
         * 1. 直接进入index的时候，参数to被改变成了"/index"，触发路由指向，就会跑beforeEach
         * 2. 再一次next指向了login，再次发生路由指向，再跑beforeEach，参数的to就被改变成了"/login"
         * 3. 白名单判断存在，则直接执行next()，因为没有参数，所以不会再次beforeEach
         */
    }
    // to: 进入的页面，下一个页面
    // from：离开之前的页面，上一个页面
    // console.log(to);
    // console.log(from);
    // console.log(next);
    // next();
    
  })