<template>
 <div>
    <!-- ログインしていない時に表示される画面 -->
    <div v-if="!isLogin">
      <v-btn v-on:click="googleLogin">Googleでログイン</v-btn>
    </div>
    <!-- ログイン中に表示される画面 -->
    <div v-else>
      {{ this.$store.state.user.email }}でログイン中です<br>
      カウンター {{ $store.state.test_count }}
      <v-btn v-on:click="count_up">数字を増やす</v-btn>
      <v-btn v-on:click="googleLogOut">ログアウト</v-btn><br>
    </div>
  </div>
</template>


<script>
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
 asyncData() {
   return {
     isLogin: false,
   };
 },
//  computed: {
    // ...mapState(['user']),
  // },
 //ここにログイン状態が変わったときの処理を書く(状態遷移)
 mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isLogin = true
        // this.setUser(user)
        this.$store.dispatch('setUser', user)
      } else {
        this.isLogin = false
        // this.setUser(null)
        this.$store.dispatch('setUser', null)
      }
    })
 },
 methods: {
  //  ...mapActions(['setUser']),
   googleLogin() {
     const provider = new firebase.auth.GoogleAuthProvider();
     firebase.auth().signInWithRedirect(provider)
    //  this.$router.push("/test")
   },
   googleLogOut() {
     firebase.auth().signOut()
   },
   count_up(){
     this.$store.dispatch('count_up')
   }
 }
};
</script>