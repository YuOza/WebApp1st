import {Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    extends: Doughnut,
    mixins: [reactiveProp],
    props: ['options'],
    mounted () {
      // this.chartData is created in the mixin.
      // If you want to pass options please create a local options object
      this.$refs.canvas.height = 175
      this.renderChart(this.chartData, this.options)
    }
}
