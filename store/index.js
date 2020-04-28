export const strict = false
import { db } from '~/plugins/firebase'

export const state = () => ({
  user: null,
  test_count: 0
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  count_up(state, payload){
    state.test_count += 1
  }
}

export const actions = {
  setUser ({ commit }, payload) {
    commit('setUser', payload)
  },
  count_up2({ commit }){
    commit('count_up')
  },
  count_up({commit}, usermail){
    // db.collection("users").add({
    db.collection("users").doc("test@user").set({
      counter: state.test_count + 1
    })
    .then(function() {
        console.log("Document successfully written!");
        commit('count_up')
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }
}

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  }
}