<template>
 <div>
    <!-- ログインしていない時に表示される画面 -->
    <div v-if="!isLogin">
      <v-btn v-on:click="googleLogin">Googleでログイン</v-btn>
    </div>
    <!-- ログイン中に表示される画面 -->
    <div v-else>
      {{ user.email }}でログイン中です<br>
      <a href="/member-page">メンバーページへ</a>
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
 computed: {
    ...mapState(['user']),
  },
 //ここにログイン状態が変わったときの処理を書く(状態遷移)
 mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isLogin = true
        // this.user = user
        this.setUser(user)
        // this.$router.push("/test")
      } else {
        this.isLogin = false
        // this.user = null
        this.setUser(null)
      }
    })
 },
 methods: {
   ...mapActions(['setUser']),
   googleLogin() {
     const provider = new firebase.auth.GoogleAuthProvider();
     firebase.auth().signInWithRedirect(provider)
    //  this.isLogin = true
    //  this.setUser(user)
     //.then(user => {
     this.$router.push("/test")
     //}).catch((error) => {
     //  alert(error)
     //});
   },
   googleLogOut() {
     firebase.auth().signOut()
    //  this.isLogin = false
    //  this.setUser(null)
     //.then(() => {

     //}).catch((error) => {
     //  alert(error)
     //})
   }
 }
};
</script>