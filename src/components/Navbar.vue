<template>

      <v-app-bar  text app class="white--text transparent"> 
        <v-flex lg3 class="text-center">
          <v-toolbar-title class="text-uppercase grey--text">
            <span class="font-weight-light display-1 primary--text">BRICK.</span>
            <span class=" display-1 primary--text">IO</span>
          </v-toolbar-title>
        </v-flex>
        <v-flex lg5 class="text-right">
            <span class="font-weight-light title"> {{brick_email}} </span>
            <span class="font-weight-light title"> {{brick_rank}} </span>
            <span class="font-weight-light title"> {{brick_level}} </span>

        </v-flex>

         
      <v-spacer></v-spacer>
      <v-btn v-if="isLoggedIn" text class="white--text">
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
export default {

  name: 'Navbar',
  mounted() {
      this.brick_email = localStorage.getItem('email')
      this.brick_level = localStorage.getItem('level')
      this.brick_rank = localStorage.getItem('rank')
      this.cookieExists();
    },
  data: () => ({
      brick_email: null,
      brick_rank: null,
      brick_level: null,
      isLoggedIn: Boolean,
  }),
  methods: {
      logout(){

      },
      cookieExists(){
          let myCookie = this.getCookie("vueCheck");
          console.log(myCookie)
          if(myCookie){
              this.isLoggedIn = true
          }else{
              this.isLoggedIn = false
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
      
};
</script>

<style>
</style>