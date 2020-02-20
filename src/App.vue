
<template>
  <v-app>
      <HomeBackground v-if="$route.name !== 'multi'" />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import HomeBackground from '@/components/HomeBackground'
export default {
  components: {HomeBackground},
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

