<template>
<v-flex sm3 md3 lg3 xl2>
  <v-slide-x-transition>
        <v-card class="mx-auto transparent" v-show="!gameActive"  height="50%">
    <v-list  class="transparent pa-0">
      <v-list-item class="pa-0"  v-for="link in links" :key="link.text" router :to="link.route" >
          <v-list-item-content class="menu justify-center my-5 ">
            <v-flex xl7 md7>
            <v-list-item-title  class=" black--text text-left headline">{{ link.text }}</v-list-item-title>
            </v-flex>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-slide-x-transition>

</v-flex>
</template>


<script>
    import {mapGetters} from "vuex"

export default {
  name: 'Mainmenu',
  data: () => ({
    links: [
        {route: '/multi', text: 'MULTIPLAYER',},
        {route: '/single', text: 'SINGLEPLAYER',},
        {route: '/profile', text: 'PROFILE'},
        {route: '/leaderboard', text: 'LEADERBOARD'},
        {route: '/leaderboard', text: 'SETTINGS'},
      ],
  }),

  computed: mapGetters(['gameActive'])
};

</script>

<style scoped>

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
.menu{
background-image: url('/orangeAbstact.png') !important;

}

.list-shadow{
 box-shadow: 0 4px 8px 0 rgba(236, 146, 0, 0.2), 0 6px 20px 0 rgba(202, 110, 4, 0.19);
}

</style>