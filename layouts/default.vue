<template>
  <v-app class="container-principal">
    <v-container class="mt-3">
      <v-main>
        <nuxt />
      </v-main>
    </v-container>
  </v-app>
</template>


<script>
export default {
  name: 'DefaultLayout'
}
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.container-principal{
  background: #e7e5e5;
}
</style>
