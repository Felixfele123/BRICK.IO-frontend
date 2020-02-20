<template>
  <v-container class="grey lighten-5 justify-center" fill-height>
    <v-flex md5>
    <Mainmenu />

  </v-flex>
  <v-flex md5>
    <v-card  class="mx-auto transparent"  height="350" >
        <v-card-title disabled class="headline white--text justify-center align-center">Skins</v-card-title>
            <v-layout row wrap justify-space-around> 
                <v-flex lg3 v-for="skin in skins" :key="skin.index" class="my-3 mx-3"> 
                    <div :class="`skin ${skin.color}`" v-on:click="changeColor"></div>
                </v-flex>
            </v-layout>
    </v-card>
  </v-flex>
  </v-container>
</template>

<script>
import Mainmenu from '@/components/Mainmenu'
  export default {
    components: {Mainmenu},
    name: 'home',
    data: () => ({
      links: [
        {route: '/multi', text: 'Multiplayer'},
        {route: '/single', text: 'Singleplayer'},
        {route: '/', text: 'Profile'},
        {route: '/leaderboard', text: 'Leaderboard'},
      ],
      skins:[
          {color: 'skin1', requiresLevel: false},
          {color: 'skin2', requiresLevel: false},
          {color: 'skin3', requiresLevel: false},
          {color: 'skin4', requiresLevel: false},
          {color: 'skin5', requiresLevel: false},
          {color: 'skin6', requiresLevel: false},
          {color: 'skin7', requiresLevel: false},
          {color: 'skin8', requiresLevel: false},
          {color: 'skin9', requiresLevel: false},
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
  opacity: 0.4;
}
.skin{
    height: 20px;
}
.skin:hover{
  opacity: 0.6;
}
.skin1{
    background-color: #ffffff;
}
.skin2{
    background-color: #e6e6e6;
}
.skin3{
    background-color: #cccccc;
}
.skin4{
    background-color: #b3b3b3;
}
.skin5{
    background-color: #999999;
}
.skin6{
    background-color:  #808080;
}
.skin7{
    background-color: #666666;
}
.skin8{
    background-color: #4d4d4d;
}
.skin9{
    background-color:  #333333;
}
.skin10{
    background-color: #1a1a1a;
}

</style>