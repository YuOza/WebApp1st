<template>
  <div>
  <v-app>
    ver:1.4
    <div v-if="nowChart=='Line'">
        <Chart 
            :chart-data="datacollection"
            :options="ChartOptions"
        ></Chart>
    </div>
    <div v-else-if="nowChart=='Pie'">
    グラフ計算日
        <client-only>
        <date-picker
            v-model="ChartDay"
            format="yyyy-MM-dd"
            >
        </date-picker>
        </client-only>
        <PieChart
            :chart-data="Piedatacollection"
            :options="PieChartOptions">
        </PieChart>
    </div>
    <v-btn text v-on:click="changeChartToL" color="primary">推移グラフ</v-btn>
    <v-btn text v-on:click="changeChartToM" color="primary">支出円グラフ</v-btn>
    <v-btn text v-on:click="changeChartToP" color="primary">収入円グラフ</v-btn>
    
    <h1 class="title">お金の出入り記録</h1>
    <v-form ref="test_form">
    <client-only>
      <date-picker
        v-model="selectDay"
        format="yyyy-MM-dd"
        required="true"
        >
      </date-picker>
    </client-only>
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
    <v-btn text v-on:click="addItem" color="primary">追加</v-btn>
    <h2 class="subtitle">出入りリスト</h2>
    <table border=1 rules=rows frame=hsides>
        <thead>
        <tr>
            <th>日付</th>
            <th>金額</th>
            <th>タグ</th>
            <th>メモ</th>
            <th>　　</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(todo, index) in todos" :key="todo.id" align="center">
            <td>{{ todo.day }}</td>
            <td>{{ todo.item }}</td>
            <td>{{ todo.tag }}</td>
            <td>{{ todo.memo }}</td>
            <td><v-btn text v-on:click="deleteItem(index)">削除</v-btn></td>
        </tr>
        </tbody>
    </table>
    所持金計算日
    <client-only>
      <date-picker
        v-model="nowSelectDay"
        format="yyyy-MM-dd"
        @selected="UpdateSum"
        >
      </date-picker>
    </client-only>
    <p>所持金 : {{ sum }}</p>
  </v-app>
  </div>
</template>
 
<script>
import firebase from '~/plugins/firebase'
import { db } from '~/plugins/firebase'
import moment from 'moment'
import Chart from '~/components/ChartSample.js'
import PieChart from '~/components/ChartPie.js'

  export default {
    components: {
        Chart,
        PieChart
    },
    name: "",
    data: function () {
      return{
      datacollection: null,
      ChartOptions: null,
      Piedatacollection: null,
      PieChartOptions: null,
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
      sum: 0,
      nowSelectDay: "",
      defaultDate: "",
      nowChart: "Line",
      ChartDay: "",
      ChartPM: false
      }
    },
    watch: {
        // 支出と収入を切り替えたらタグをリセット
        pm : function(){
            this.selectTag = ''
        },
    },
    created(){
        this.selectDay = new Date()
        this.nowSelectDay = this.selectDay
        this.ChartDay = this.selectDay
        const fnsDay = moment(this.nowSelectDay).format('YYYY-MM-DD')
        const mydoc = db.collection('users').doc(this.$store.state.user.email)
        const querySnapshot = mydoc.collection("count-list").orderBy("day")
            querySnapshot.get().then(snapshot => {
                snapshot.forEach(doc => {
                    var todo = {
                        day: doc.data().day,
                        item: doc.data().item,
                        tag: doc.data().tag,
                        memo: doc.data().memo,
                        id: doc.id
                    }
                    this.todos.push(todo)
                    if (todo.day <= fnsDay){
                        this.sum += todo.item
                    }
                });
                this.fillData()
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
            // JSON.stringify()
    },
    methods: {
        customformat: function(value){
            return moment(value).format('YYYY-MM-DD');
        },
        addItem: function(event){
            if(this.$refs.test_form.validate()){
                if(this.pm == "minus"){
                    this.amount = -this.amount
                }
                if(String(this.memo) == "undefined"){
                     this.memo = ""
                }
                var todo = {
                    day: this.customformat(this.selectDay),
                    item: this.amount,
                    tag: this.selectTag,
                    memo: this.memo
                };
                var newTodo = db.collection("users").doc(this.$store.state.user.email).collection("count-list").doc()
                newTodo.set(todo)
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
                todo.id = newTodo.id
                this.todos.push(todo)

                this.todos.sort(function(a, b) {
                if (a.day > b.day) {
                    return 1;
                } else {
                    return -1;
                }
                })
                this.UpdateSum(this.nowSelectDay)
                this.fillData()
                this.fillDataToPie()
                this.$refs.test_form.reset()
            }
        },
        deleteItem: function(index){
            if(confirm('Are you sure?')){ //確認をとる
                db.collection("users").doc(this.$store.state.user.email).collection("count-list").doc(this.todos[index].id).delete().then(function() {
                    console.log("Document successfully deleted!");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
                this.todos.splice(index, 1);
                this.UpdateSum(this.nowSelectDay)
                this.fillData()
                this.fillDataToPie()
            }
        },
        UpdateSum: function(Date){
            const setDay = this.customformat(Date)
            var nowsum = 0
            const nowTodos = this.todos
            const length = nowTodos.length
            for(let i = 0; (i < length) && (nowTodos[i].day <= setDay); i++){
                nowsum += nowTodos[i].item
            }
            this.sum = nowsum
        },
        fillData: function(){
            var dates = [] 
            var money = []
            var atsum = 0
            const nowTodos = this.todos
            const tolength = nowTodos.length
            for(let i = 0; (i < tolength); i++){
                atsum += nowTodos[i].item
                money.push(atsum)
                const day = new Date(String(nowTodos[i].day))
                dates.push(day)
            }
            this.datacollection = {
                labels: dates,
                datasets: [
                    {
                        label: '所持金の推移',
                        data: money,
                        lineTension: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }     
                ]
            },
            this.ChartOptions = {
                scales: {
                xAxes: [{
                    type: 'time', // specify time series type
                    time: {
                        unit: 'day'
                    },
                    distribution: 'linear', // use 'linear'(default) or 'series'
                    scaleLabel: {
                        display: true,
                        labelString: 'day'
                    }
                }],
                yAxes: [{
                    ticks: {
                    beginAtZero: true,
                    stepSize: 100,
                    }
                }]
                }
            }
        },
        fillDataToPie: function(){
            var info = new Array(3)
            if (this.ChartPM){
                info = this.PlusPie()
            }else{
                info = this.MinusPie()
            }
            this.Piedatacollection = {
                labels: info.tags,
                datasets: [
                    {
                        label: 'Pie',
                        data: info.money,
                        backgroundColor: info.bgc
                    }     
                ]
            },
            this.PieChartOptions = {
            }
        },
        PlusPie: function(){
            var obj = new Object();
            const tags = this.items2
            const bgcp = [
                "rgb(0, 0, 255)",
                "rgb(0, 0, 200)",
                "rgb(0, 0, 150)",
                "rgb(0, 0, 100)",
                "rgb(0, 0, 50)"
            ] 
            var money = Array(tags.length)
            money.fill(0)
            const nowTodos = this.todos
            const tolength = nowTodos.length
            const setDay = this.customformat(this.ChartDay)
            for(let i = 0; (i < tolength) && (nowTodos[i].day <= setDay); i++){
                switch(nowTodos[i].tag){
                    case tags[0]:
                        money[0] += (nowTodos[i].item)
                        break
                    case tags[1]:
                        money[1] += (nowTodos[i].item)
                        break
                    case tags[2]:
                        money[2] += (nowTodos[i].item)
                        break
                    case tags[3]:
                        money[3] += (nowTodos[i].item)
                        break
                    case tags[4]:
                        if (nowTodos[i].item > 0){
                            money[4] += (nowTodos[i].item)
                        }
                        break
                }
            }
            obj.tags = tags
            obj.money = money
            obj.bgc = bgcp
            return obj
        },
        MinusPie: function(){
            var obj = new Object();
            const tags = this.items
            const bgcp = [
                "rgb(255, 0, 0)",
                "rgb(200, 0, 0)",
                "rgb(150, 0, 0)",
                "rgb(100, 0, 0)"
            ]
            var money = Array(tags.length)
            money.fill(0)
            const nowTodos = this.todos
            const tolength = nowTodos.length
            const setDay = this.customformat(this.ChartDay)
            for(let i = 0; (i < tolength)&& (nowTodos[i].day <= setDay) ; i++){
                switch(nowTodos[i].tag){
                    case tags[0]:
                        money[0] += (nowTodos[i].item)*(-1)
                        break
                    case tags[1]:
                        money[1] += (nowTodos[i].item)*(-1)
                        break
                    case tags[2]:
                        money[2] += (nowTodos[i].item)*(-1)
                        break
                    case tags[3]:
                        if (nowTodos[i].item < 0){
                            money[3] += (nowTodos[i].item)*(-1)
                        }
                        break
                }
            }
            obj.tags = tags
            obj.money = money
            obj.bgc = bgcp
            return obj
        },
        changeChartToL: function(){
            this.nowChart = 'Line'
        },
        changeChartToM: function(){
            this.ChartPM = false
            this.fillDataToPie()
            this.nowChart='Pie'
        },
        changeChartToP: function(){
            this.ChartPM = true
            this.fillDataToPie()
            this.nowChart='Pie'
        },
    }
    }
</script>
 
<style scoped>
</style>