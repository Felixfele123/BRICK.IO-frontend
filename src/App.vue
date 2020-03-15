
<template>
  <v-app class="black">
    <Multi v-if="this.$route.path === '/'"/>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Multi from '@/components/Multi'
export default {
  components: {Multi},
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
<style>
main{
  background-color: black !important;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
