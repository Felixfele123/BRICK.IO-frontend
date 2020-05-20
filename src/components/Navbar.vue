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
        <v-flex lg5 class="text-right mt-3">
            <span class="font-weight-light">{{username}}</span>
            <v-avatar size="30" class="mx-5">
              <img src="bronze-3.png" alt="" srcset="">
            </v-avatar>
        </v-flex>
        <v-col @click="log()"           
          xs="2"
          sm="3"
          md="3"
          lg="2">
							<v-row>
							<p class="ml-5 caption grey--text  mb-0"> Level {{level}}</p>
                <v-row class="align-center justify-end">
                <p class=" text-md-right mb-0 mx-2"> {{coins}} </p>
                <v-avatar tile class="justify-center align-center text-center mr-6" size="20">
                  <img class="" src="coin.png" alt="" srcset="">
                </v-avatar> 								
                </v-row>
							</v-row>
              <v-progress-linear rounded class="mt-0" :value="xpBarValue" color="amber" height="24" reactive>
              <div class="xp-text ml-6 black--text"><strong> {{xp}} / {{xpTop}} xp </strong></div>	
              </v-progress-linear>          
        </v-col>

         
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
import {mapGetters, mapActions, mapMutations} from "vuex"
export default {

  name: 'Navbar',
  created(){

  },

  data: () => ({
      /*brick_email: allUserdata.email,
      brick_rank: allUserdata.rank,
      brick_level: allUserdata.level,*/
      isLoggedIn: Boolean,
      brick_email: null,
      username: 'Guest',
      rank: null,
      buffer_value: 100,
      coins: 0,
      xp: 0,
      level: 1,
      xpTop: 1000,
      xpLevel:0,
      xpBarValue: 0,
      bool: true

  }),
    mounted() {
      setInterval(this.updateAll, 500)
    },
  methods: {
      ...mapMutations(["setRefreshData"]),
      ...mapActions(["fetchUserdata"]),
      logOut(){

        localStorage.removeItem("email");
        localStorage.removeItem("level");
        localStorage.removeItem("rank");
        document.cookie = "token=null";
        this.delete_cookie("vueCheck");
        this.$router.push({ path: '/login' })
        logoutService.logout();
      },
      async log(){
        console.log(this.refreshData)
        await this.fetchUserdata()
        this.calculateExtra()
      },
      async updateAll(){
        if(this.refreshData){
        await this.fetchUserdata()
        this.calculateExtra()
        this.cookieExists();
        this.setRefreshData(false) 
        this.username = this.allUserdata[0].username
        this.level = this.allUserdata[0].level
        this.xp = this.allUserdata[0].xp
        this.coins = this.allUserdata[0].coins
        console.log("refereshed!")
        }
        

      },
      calculateExtra(){
        let potens = this.allUserdata[0].level - 1
        this.xpTop = Math.floor(Math.pow(1.3, potens) * 1000)
        this.xpBarValue = 100/this.xpTop*this.allUserdata[0].xp
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
  computed: mapGetters(["allUserdata", "refreshData"]),
  

      
};
</script>

<style scoped>
a{
  text-decoration: none !important;
}
.xp-text{
  text-decoration: none !important;
  opacity: 0.7;
}
</style>