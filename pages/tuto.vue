<template>
  <div>
    <h1>table page</h1>
    <button @click="fetch">fetch</button>
    {{ length }}件 fetch しました
    <table border="1">
      <tr>
        <th>年齢</th>
        <th>推定ユーザー数</th>
      </tr>
      <tr v-for="item in items" :key="item.age">
        <td>{{ item.age }}</td>
        <td>{{ item.users }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: []
  }),
  computed: {
    length() {
      return this.items.length
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.items = getJson()
    }
  }
}
function getJson() {
  const ages = Array.from(
    new Set(
      new Array(parseInt(Math.random() * 100))
        .fill(null)
        .map(() => parseInt(Math.random() * 100))
    )
  )
  return ages.map((age) => ({
    age,
    users: Math.random() * 10000
  }))
}
</script>
