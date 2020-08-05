import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userName: '',
    userID:'',
    userEmail:'',
    types:['填空题','选择题','简答题','其他'],
    levels:['简单','一般','困难','极难'],
    powers:['管理员','查改','仅查'],
    banks:[]
  },
  getters: {
  },
  mutations: {
    setBanks(state, banks){
      state.banks=[]
      for(let i in banks)
      {
        state.banks.push(banks[i].Bank_name)
      }
    },
    setUser (state, user) {
      state.userName = user.name
      state.userID = parseInt(user.ID)
      state.userEmail = user.email
    },
    initUser(state)
    {
      state.userName = ''
      state.userID = ''
      state.userEmail = ''
    }
    // old
  },
  actions: {

  }
})

export default store
