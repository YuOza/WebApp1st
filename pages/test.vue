<template>
  <div>
  <v-app>
    <h1 class="title">TODOの名前1</h1>
    <v-form ref="test_form">
    <v-text-field
          v-model.number="newItem"
          label="入力必須のテキストフィールド"
          :rules="[required]"
          type="number"
    ></v-text-field>
    </v-form>
    <v-btn text v-on:click="addItem">追加するv</v-btn>
    <h2 class="subtitle">TODOリスト</h2>
    <li v-for="todo in todos" :key="todo.id">
        {{ todo.item }}
    </li>
  </v-app>
  </div>
</template>
 
<script>
  export default {
    name: "",
    data: function () {
      return{
      newItem:'',
      todos:[],
      required: value => !!value || "必ず入力してください"
      }
      
    },
    methods: {
        addItem: function(event){
            if(this.$refs.test_form.validate()){
                var todo = {
                    item: this.newItem
                };
                this.todos.push(todo)
                this.$refs.test_form.reset()
            }
        }
    }
  }
</script>
 
<style scoped>
</style>