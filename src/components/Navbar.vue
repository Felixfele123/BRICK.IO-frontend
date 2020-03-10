<template>

      <v-app-bar text app class="transparent white--text "> 
        <v-flex lg3 class="text-center">
          <v-toolbar-title class="text-uppercase grey--text" >
            <router-link to="/">            
              <span class="font-weight-light display-1 primary--text">BRICK.</span>
              <span class="display-1 primary--text">IO</span>
            </router-link>

          </v-toolbar-title>
        </v-flex>
        <v-flex lg5 class="text-right">
            <span class="font-weight-light">{{allUserdata[0].username}}</span>
            <v-avatar size="30" class="mx-5">
              <img src="bronze-3.png" alt="" srcset="">
            </v-avatar>
            <span class="font-weight-lighte title">  {{allUserdata[0].level}} </span>
        </v-flex>

         
      <v-spacer></v-spacer>
      <v-btn v-if="isLoggedIn" @click="logOut" text class="white--text">
        <span >Sign Out</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
      <v-btn v-else text class="white--text">
        <router-link to="/login">
        <span >Sign in</span>
        <v-icon right>mdi-login</v-icon>
        </router-link>
      </v-btn>
    </v-app-bar>

</template>


<script>
import logoutService from '../logoutService.js'
import {mapGetters, mapActions} from "vuex"
export default {

  name: 'Navbar',
  mounted() {
      this.fetchUserdata()
      this.brick_email = this.allUserdata[0].email
      this.brick_username = this.allUserdata[0].username
      this.brick_level = this.allUserdata[0].level
      this.brick_rank =  this.allUserdata[0].rank
      this.cookieExists();
    },
  data: () => ({
      /*brick_email: allUserdata.email,
      brick_rank: allUserdata.rank,
      brick_level: allUserdata.level,*/
      isLoggedIn: Boolean,
      brick_email: null,
      brick_username: null,
      brick_level: null,
      brick_rank: null,

  }),
  methods: {
      ...mapActions(["fetchUserdata"]),
      logOut(){
        localStorage.removeItem("email");
        localStorage.removeItem("level");
        localStorage.removeItem("rank");
        document.cookie = "token=null";
        this.allUserdata.username = "";
        this.allUserdata.level = "";
        this.allUserdata.email = "";
        this.delete_cookie("vueCheck");
        this.$router.push({ path: '/login' })
        logoutService.logout();

        console.log(this.allUserdata)

      },
      delete_cookie( name ) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      },
      cookieExists(){
          let myCookie = this.getCookie("vueCheck");
          if(myCookie){
              this.isLoggedIn = true
          }else{
              this.isLoggedIn = false
          }
          console.log(this.allUserdata)
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
  },
  computed: mapGetters(["allUserdata"]),
  

      
};
</script>

<style scoped>
a{
  text-decoration: none !important;
}
</style>