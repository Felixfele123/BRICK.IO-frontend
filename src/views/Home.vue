<template>
  <v-container class="justify-center" fill-height>

      <Navbar />

    <v-flex md5>
    <Mainmenu />

  </v-flex>
  <v-flex md5>
    <v-card  class="mx-auto transparent"  height="350" >
      
      <v-card-title  disabled class="username white--text justify-center align-start headline"></v-card-title>
      <v-card-title  disabled class="username white--text justify-center align-start headline"> {{brick_email}} </v-card-title>
  
      <v-row>
        <v-flex lg6>
          <v-card-title disabled class="white--text justify-center align-center">Level: {{brick_level}}</v-card-title>
        </v-flex>
        <v-flex lg6>
          <v-card-title disabled class="white--text justify-center align-center">Rank: {{brick_rank}}</v-card-title>
        </v-flex>
      </v-row>
    </v-card>
  </v-flex>
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Mainmenu from '@/components/Mainmenu.vue'

  export default {
    components: { Mainmenu, Navbar },
    mounted() {
      this.brick_email = localStorage.getItem('email')
      this.brick_level = localStorage.getItem('level')
      this.brick_rank = localStorage.getItem('rank')
    },
    name: 'home',
    data: () => ({
      links: [
        {route: '/multi', text: 'Multiplayer'},
        {route: '/single', text: 'Singleplayer'},
        {route: '/', text: 'Profile'},
        {route: '/leaderboard', text: 'Leaderboard'},
      ],
      brick_email: null,
      brick_rank: null,
      brick_level: null

    }),
    methods: {
      log(){
        console.log(this.userdata)
      }
    }
  }
</script>
<style>


.username{
    text-decoration: underline;
  }

</style>
