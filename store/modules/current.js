const current = {
  namespaced: true,
  state: {
    userInfo:{},//用户数据
    chat_token: null, // 聊天 token
    notice_token: null, // 通知 token
    diag_list: [],//业务诊断缓存
    med_list: [],//业务药品缓存
    patInfo: {},//患者信息
  },
  mutations: {
    SET_USERINFO: (state, value) => {
      state.userInfo = value;
    },
    SET_CHAT_TOKEN: (state, token) => {
      state.chat_token = token;
    },
    SET_NOTICE_TOKEN: (state, token) => {
      state.notice_token = token;
    },
    SET_DIAG_LIST: (state, list) => {
      state.diag_list = list;
    },
    SET_MED_LIST: (state, list) => {
      state.med_list = list;
    },
    SET_PATINFO: (state, list) => {
      state.patInfo = list;
    },

  },
  actions: {
    setUserInfo({
      commit
    }, value) {
      commit('SET_USERINFO', value);
    },
    setSocketToken({
      commit
    }, data) {
      commit('SET_CHAT_TOKEN', data.chat);
      commit('SET_NOTICE_TOKEN', data.notice);
    },
    setDiagList({
      commit
    }, list) {
      commit('SET_DIAG_LIST', list);
    },
    setMedList({
      commit
    }, list) {
      commit('SET_MED_LIST', list);
    },
    setPatInfo({
      commit
    }, list) {
      commit('SET_PATINFO', list);
    },

  }
}

export default current;