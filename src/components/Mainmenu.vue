<template>
    <v-card shaped class="mx-auto transparent"  height="350">
    <v-list  class="transparent align-center">
      <v-list-item dense  v-for="link in links" :key="link.text" router :to="link.route" >
          <v-list-item-content class="justify-center align-center my-3 primary">
            <v-flex lg7>
            <v-list-item-title  class=" black--text text-left headline">{{ link.text }}</v-list-item-title>
            </v-flex>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
</template>


<script>
export default {
    
  name: 'Mainmenu',
  data: () => ({
    links: [
        {route: '/multi', text: 'MULTIPLAYER',},
        {route: '/single', text: 'SINGLEPLAYER',},
        {route: '/', text: 'PROFILE'},
        {route: '/leaderboard', text: 'LEADERBOARD'},
      ],
  }),
};
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
.v-list-item{

clip-path: polygon(98% 0, 90% 100%, 0 95%, 0 10%);
}

</style>