<template>
  <v-container class="grey lighten-5 justify-center" fill-height>
    <Navbar />

  
    <v-flex md5 >

    <Mainmenu />
  </v-flex>
  <v-flex md5 >
    <v-card class="mx-auto transparent justify-center"  height="350">
        <v-card-title disabled class="headline white--text justify-center align-center">Profile</v-card-title>
        <v-card-text class="white--text text-center body-1"><router-link to="/login"> Sign in</router-link> | <router-link to="/signup"> Sign up</router-link> </v-card-text>
    <v-card-text>
       <v-form class="px-3 text-center" @submit.prevent="login">
           <v-text-field class="theme--dark" label="email" :rules="emailRules" v-model="email"></v-text-field>
           <p v-if="useremail" class="red--text">{{useremail}}</p>
            <v-btn @click="login" >Send login code</v-btn>
        </v-form> 
    </v-card-text>
    <v-layout column align-center>
      <v-flex class="mt-4 mb-3">
          
          <div class="text-center">
             <v-dialog dark v-model="dialog" width="500">
              <v-card>
                <v-card-title class="lighten-2" primary-title><h2> Confirm your identity</h2></v-card-title>
                <v-card-text>We have sent an email to you, might take a minute</v-card-text>
                <v-card-text>
                  <v-form class="px-3" >
                    <v-text-field class="theme--dark" placeholder="XXXXXX" v-model="code"></v-text-field>
                    <p v-if="error" class="red--text">{{error}}</p>
                    <v-btn color="white" class="black--text" @click="confirmIdentity">Submit</v-btn>
                  </v-form> 
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </v-flex>
    </v-layout>
   

    </v-card>
    
  </v-flex>
  
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import UserService from '../UserService.js'
import ConfService from '../ConfService.js'
import Mainmenu from '@/components/Mainmenu.vue'
  export default {
    components: {Mainmenu, Navbar},
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
      email: '',
      dialog: false,
      error: "",
      code: "",
      useremail: "",
    }),
    methods:{
      async login(){
        this.error = "";
        UserService.loginUser(this.email)
        console.log(this.emailRules)
        /*let myCookie = this.getCookie("createUser");
          if (myCookie == null) {
              // do cookie doesn't exist stuff;
              this.error1 = "invalid email"
              
          }
          else {
              // do cookie exists stuff
              this.dialog = true;
          }*/
          let test = /.+@.+\..+/.test(this.email)
            console.log(test)
            if(test){
              this.dialog = true
            }
      },
      async confirmIdentity(){

          let res = await ConfService.confirmCode(this.code)

          let myCookie = this.getCookie("vueCheck");
          console.log(myCookie)
          if(myCookie){
              this.$router.push({ path: '/home' })
          }else{
              this.error = "invalid code"
          }
          console.log(this.error)
          
          if(res){
              this.useremail = res.email
          }
      },

      getCookie(name) {
    let dc = document.cookie;
    let prefix = name + "=";
    let begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        let end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, this.end));
},
    }
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