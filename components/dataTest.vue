<script>
new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
      text1: ""
  },
  required: value => !!value || "You must write!" 
});
</script>>