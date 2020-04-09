<template>
  <div>
      <nuxt-link to="/next"> Go to Next</nuxt-link>
      <nuxt-link to="/tuto"> Go to tuto</nuxt-link>
      <nuxt-link to="/test"> Go to test</nuxt-link>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
