<template>
  <v-container class="black justify-center pa-0"  fluid fill-height>
      <Navbar />
      <Mainmenu />

  <v-layout row wrap justify-center align-center>
  <v-flex  md10 lg10>
    <v-card  class="mx-auto transparent"  height="350" >
      
  
      <v-row>
        <v-flex md6 lg6>
                <UserBrick />
                <v-layout fill-height row wrap class="align-end my-10">
                  <v-flex md6>
                    <v-card-actions class="justify-center">
                    <v-btn small class="align-end justify-end">click me</v-btn>
                    </v-card-actions>
                  </v-flex>
                  <v-flex md6>
                    <v-card-actions class="justify-center">
                    <v-btn small class="align-end justify-end">click me</v-btn>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
        </v-flex>
        <v-flex md6 lg6 class="">
          <v-list-item class="">
            <v-list-item-content class="">
              <v-list-item-avatar tile class="justify-center text-center" size="100">
                <img class="" src="bronze-3.png" alt="" srcset="">
              </v-list-item-avatar>

              
            
                      <v-list-item-title class="text-center rome white--text">BRONZE III </v-list-item-title>
                      <v-list-item-subtitle class="text-center rome grey--text caption">DIV XI</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>



        </v-flex>
      </v-row>
    </v-card>
  </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Mainmenu from '@/components/Mainmenu.vue'
import UserBrick from '@/components/UserBrick'


  export default {
    components: { Mainmenu, Navbar, UserBrick},
    mounted() {
      this.brick_email = localStorage.getItem('email')
      this.brick_level = localStorage.getItem('level')
      this.brick_rank = localStorage.getItem('rank')
    },
    name: 'profile',
    data: () => ({
      links: [
        {route: '/multi', text: 'Multiplayer'},
        {route: '/single', text: 'Singleplayer'},
        {route: '/', text: 'PROFILE'},
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
.rome { 
	font-family: TimesNewRoman,Times New Roman,Times,Baskerville,Georgia,serif; 
}




</style>
