<template>
  <div class="text-center">
    <v-dialog dark v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn  v-on="on">Send login code</v-btn>

      </template>
      <v-card>
        <v-card-title class="lighten-2" primary-title><h2> Confirm your identity</h2></v-card-title>
        <v-card-text>We have sent an email to you, might take a minute</v-card-text>
        <v-card-text>
            <v-form class="px-3" >
           <v-text-field class="theme--dark" placeholder="XXXXXX"></v-text-field>
           <v-btn @click="showUsers"  color="white" class="black--text" >Submit</v-btn>
        </v-form> 
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserService from '../UserService'
export default {
    data(){
        return{
            error: null,
            username: null,
            email: null,
            users: [],
            dialog: false
        }
        
    },
    methods:{
    },
    async created(){
      try{
        this.users = await UserService.getUsers();
      }catch(err){
        this.error = err.message;
      }
    }
}
</script>
<style>

label{
    color:white !important;
}



</style>