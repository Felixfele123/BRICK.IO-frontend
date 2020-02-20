<template>
  <v-container class="grey lighten-5 justify-center" fill-height>
    <v-flex md5>

      <Mainmenu />
    
  </v-flex>
  <v-flex md5>
    <v-card  class="grey mx-auto transparent"  height="350">
        <v-card-title disabled class="headline white--text justify-center align-center">Leaderboard</v-card-title>
    </v-card>
  </v-flex>
  </v-container>
</template>

<script>

import Mainmenu from '@/components/Mainmenu.vue'
  export default {
    components: {Mainmenu},
    name: 'home',
    data: () => ({
      links: [
        {route: '/multi', text: 'Multiplayer'},
        {route: '/single', text: 'Singleplayer'},
        {route: '/', text: 'Profile'},
        {route: '/leaderboard', text: 'Leaderboard'},
      ]
    }),
  }
</script>
<style>

.v-card {
  z-index: +2;
}
.v-list-item {
  transition: opacity .2s ease-in-out;
}


.v-list-item:hover{
  opacity: 0.6;
}


</style>