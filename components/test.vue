<template>
  <div>
  <v-app>
    <h1 class="title">お金の出入り記録</h1>
    <v-form ref="test_form">
    <v-date-picker  
        v-model="selectDay">
    </v-date-picker>
    <v-radio-group
        v-model="pm"
        :rules="[required]"
        >
        <v-radio label="収入" value="plus"></v-radio>
        <v-radio label="支出" value="minus"></v-radio>
    </v-radio-group>
    <v-text-field
        v-model.number="amount"
        label="金額"
        :rules="[required, plus_only]"
        type="number"
    ></v-text-field>
    <template v-if="pm==true||pm=='plus'">
        <v-select
            v-model="selectTag"
            label="タグ"
            :items="items2"
            :rules="[required]"
        ></v-select>
    </template>
    <template v-else>
        <v-select
        v-model="selectTag"
        label="タグ"
        :items="items"
        :rules="[required]"
    ></v-select></template>
    <v-text-field
        v-model="memo"
        label="備考"
    ></v-text-field>
    </v-form>
    <v-btn text v-on:click="addItem">追加</v-btn>

    <h2 class="subtitle">出入りリスト</h2>
    <table border="1">
        <tr>
            <th>日付</th>
            <th>金額</th>
            <th>タグ</th>
            <th>メモ</th>
            <th>　　</th>
        </tr>
        <tr v-for="(todo, index) in todos" :key="todo.id">
            <td>{{ todo.day }}</td>
            <td>{{ todo.item }}</td>
            <td>{{ todo.tag }}</td>
            <td>{{ todo.memo }}</td>
            <td><v-btn text v-on:click="deleteItem(index)">削除</v-btn></td>
        </tr>
    </table>
    <p>所持金 : {{ sum }}</p>
  </v-app>
  </div>
</template>
 
<script>
import firebase from '~/plugins/firebase'
import { db } from '~/plugins/firebase'
  export default {
    name: "",
    data: function () {
      return{
      selectDay: '',
      pm: true,
      amount: '',
      todos:[],
      items: ['食費', '交通費', '趣味', 'その他'],
      items2:['給料', '臨時収入', 'バイト', '小遣い', 'その他'],
      selectTag:'',
      memo:'',
      required: value => !!value || "入力必須",
      limit_length: value => value.length <= 10 || "10文字以内" ,
      plus_only: value => value > 0 ||"正の数のみ",
      sum: 0
      }
    },
    watch: {
        // 支出と収入を切り替えたらタグをリセット
        pm : function(){
            this.selectTag = ''
        }
    },
    methods: {
        addItem: function(event){
            if(this.$refs.test_form.validate()){
                if(this.pm == "minus"){
                    this.amount = -this.amount
                 }
                var todo = {
                    day: String(this.selectDay),
                    item: this.amount,
                    tag: this.selectTag,
                    memo: this.memo
                };
                db.collection("users").doc(this.$store.state.user.email).collection("count-list").doc().set(todo)
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
                this.todos.push(todo)
                this.sum += Number(this.amount)
                this.$refs.test_form.reset()
            }
        },
        deleteItem: function(index){
            if(confirm('Are you sure?')){ //確認をとる
               this.sum -= Number(this.todos[index].item)
               this.todos.splice(index, 1);
            }
        },
        
    }
  }
</script>
 
<style scoped>
</style>