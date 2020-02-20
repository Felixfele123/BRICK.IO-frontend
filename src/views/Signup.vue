<template>
  <v-container class="grey lighten-5 justify-center" fill-height>
    <v-flex md5>
    <Mainmenu />
  </v-flex>
  <v-flex md5>
    <v-card class="mx-auto transparent justify-center"  height="350">
        <v-card-title disabled class="headline white--text justify-center align-center">Profile</v-card-title>
        <v-card-text class="white--text text-center body-1"><router-link to="/login"> Sign in</router-link> | <router-link to="/signup"> Sign up</router-link> </v-card-text>
         
    <v-card-text>
       <v-form class="px-3">
           <v-text-field class="theme--dark" label="email" :rules="emailRules" v-model="email" ></v-text-field>
           <v-text-field class="theme--dark" label="username" :rules="nameRules" v-model="username"></v-text-field>
        </v-form> 

    </v-card-text>
    <v-flex class="mt-4 mb-3">
          <Popup/>
        </v-flex>
    <v-card-text> </v-card-text>
    </v-card>
    
  </v-flex>
  
  </v-container>
</template>

<script>
import Mainmenu from '@/components/Mainmenu.vue'
import Popup from '@/components/Popup.vue'
  export default {
    components: {Popup, Mainmenu},
    name: 'home',
    data: () => ({
      links: [
        {route: '/multi', text: 'Multiplayer'},
        {route: '/single', text: 'Singleplayer'},
        {route: '/', text: 'Profile'},
        {route: '/leaderboard', text: 'Leaderboard'},
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 3) || 'Name must be more than 3 characters',
      ],
      users: [],
      username: null,
      email:  null,
      error: null
    }),
    methods:{
      
    },
    
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
label{
    color:white !important;
}



</style>