<template>
  <div>
    <v-app>
      Here is Next page
      <v-radio-group>
        <v-radio label="収入"></v-radio>
        <v-radio label="支出"></v-radio>
      </v-radio-group>
      <!-- Comment 
        <v-row justify="center">
            <v-date-picker v-model="picker"></v-date-picker>
        </v-row>
        <p>{{ picker }}</p>
        -->
      <v-form>
        <v-text-field
          v-model="delta"
          label="変動量"
          :rules="[required]"
        ></v-text-field>
      </v-form>
      <p>{{ delta }}</p>
      <input v-model="message" placeholder="edit me" />
      <p>Message is: {{ message }}</p>
    </v-app>
  </div>
</template>

<script>
export default {
    name: "",
    data: function () {
      return{
      message:''
      }
    }
}
</script>
