<template>
  <v-container class="pa-0"  fluid fill-height>
      
      <Navbar />
      
      <Mainmenu v-if="!game"/>
    <v-slide-y-transition>
            <v-layout v-show="!gameActive" class="align-center justify-center">

            <div class="chat">
        
        <v-card  class="mx-auto transparent justify-center" >
            <div id="chat-window" class="chatbox" >
                    <div  v-for="messageobj in messages" :key="messageobj.index">
                        <v-card-text id="output" class="pa-0">
                            <p class="white--text ma-0">
                                <v-avatar size="20">
                                    <img src="bronze-3.png" alt="" srcset="">
                                </v-avatar>
                                <strong class="primary--text ml-1">
                                    {{messageobj.user}}
                                </strong>
                                    <br>
                                <span class="pl-8">
                                    {{messageobj.message}}
                                </span>
                            </p>
                        </v-card-text>
                        <div id="feedback"></div>
                    </div>
                </div>

                <v-form @submit.prevent="sendMessage" ref="form" class="chatMessage">
                    <v-card-text class="align-end">
                        <v-text-field class="theme--dark" :rules="messageRules" placeholder="send a message.." v-model="message"></v-text-field>
                    </v-card-text>
                </v-form>
            </v-card>
            </div>
            </v-layout>     
    </v-slide-y-transition>

  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Mainmenu from '@/components/Mainmenu.vue'
import io from 'socket.io-client';
import {mapGetters} from "vuex"

  export default {
    components: { Mainmenu, Navbar},
    mounted() {
      this.user = localStorage.getItem('username')
      this.brick_level = localStorage.getItem('level')
      this.brick_rank = localStorage.getItem('rank')

            this.socket.on("MESSAGE", data => {
           
            console.log("recieved data..")
                this.messages.push({message: data.message, user: data.user});
                console.log(this.messages)
                var messageBody = document.querySelector('#chat-window');
                messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        });
    },
    name: 'profile',
    data: () => ({

      links: [
        {route: '/multi', text: 'Multiplayer'},
        {route: '/single', text: 'Singleplayer'},
        {route: '/', text: 'PROFILE'},
        {route: '/leaderboard', text: 'Leaderboard'},
      ],
      messageRules: [
        v => (v && v.length >= 1) || 'cant send empty message',
        v => (v && v.length <= 50) || 'message must be less than 50 characters',
      ],

      user: "",
      message: "",

      messages: [],
      brick_email: null,
      brick_rank: null,
      brick_level: null,

      socket: io('localhost:3456')

    }),
    methods: {

        sendMessage(e){
            e.preventDefault();
                this.socket.emit('SEND_MESSAGE', {
                    user: this.user,
                    message: this.message
                });
                this.$refs.form.reset()

         
        },
    },
    computed: mapGetters(['gameActive'])

  }
</script>
<style scoped>



    .chat{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 25%;
    }
    .chatbox{

        overflow-y: scroll;
        max-height: 350px

    }
    .chatMessage{
        position: relative;
    }
    .chat-window{
        opacity: 0.7; 

    }
    p{
        opacity: 0.8; 
    }
    strong{
        opacity: 0.8;
    }

    ::-webkit-scrollbar {
  width: 10px;
}


/* Track */
    ::-webkit-scrollbar-track {
    background: rgb(0, 0, 0);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
    background: rgb(250, 134, 1);
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
    background: rgb(179, 86, 0);
    }
 

</style>
