import { Login } from "@/api/login"
import { setToken, removeToken, setUsername, getUsername, removeUsername } from "@/utils/app";

const state = {
    isCollapse: JSON.parse(window.sessionStorage.getItem("isCollapse")) || false,
    token: "",
    username: getUsername() || ""
}

const getters = {
    isCollapse: (state) => state.isCollapse,
    username: state => state.username
}

const mutations = {
    SET_COLLAPSE(state) {
      state.isCollapse = !state.isCollapse;
      // html5本地存储
      window.sessionStorage.setItem(
        "isCollapse",
        JSON.stringify(state.isCollapse)
      );
    },
    SET_TOKEN(state, value) {
      state.token = value
    },
    SET_USERNAME(state, value) {
      state.username = value
    }
  }

  const actions = {
    login({ commit }, repuestData) {
      return new Promise((resolve, reject) => {
          Login(repuestData).then((response) => {
              let data = response.data.data
              // 普通的
              // content.commit('SET_TOKEN', data.toKen);
              // content.commit('SET_USERNAME', data.username);
              // 解构的
              commit('SET_TOKEN', data.token);
              commit('SET_USERNAME', data.username);
              setToken(data.token);
              setUsername(data.username);
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    exit({ commit }){
      return new Promise((resolve, reject) => {
          removeToken();
          removeUsername();
          commit('SET_TOKEN', '');
          commit('SET_USERNAME', '');
          resolve();
      })
    }
  }

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
