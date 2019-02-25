<template>
  <v-app>

    <v-content>
      <v-toolbar color="cyan" dark left  dense  app>
        <v-toolbar-side-icon ></v-toolbar-side-icon>
        <v-toolbar-title>BX24 Gmail</v-toolbar-title>
      </v-toolbar>
      <component  v-on:login="login" :is="selectComponent" v-if="selectComponent"></component>
    </v-content>
  </v-app>
</template>

<script>
import Base from './components/base'
import Auth from './components/auth'


export default {
  name: 'App',
  components: {
    Auth,
    Base
  },
  data () {
    return {
      selectComponent: null
    }
  },
  mounted() {
    if (typeof(localStorage.hook) != 'undefined' && typeof(localStorage.baseUrl) != 'undefined'  && typeof(localStorage.userId) != 'undefined') {
      this.selectComponent = 'Base';
      let baseUrl = localStorage.baseUrl+'/rest/'+localStorage.userId+'/'+localStorage.hook;
      this.$store.dispatch('setBaseUrl', baseUrl);

    } else {
      this.selectComponent = 'Auth';
    }
  },
  methods: {

    login: function () {
      this.selectComponent = 'Base';
    },

    getData: function () {

        chrome.storage.sync.get(['email'], (result) => {
          this.$store.dispatch("setEmail", result.email);
        });

        chrome.storage.sync.get(['name'], (result) => {
          this.$store.dispatch("setName", result.name);
          this.$store.dispatch("init").then(() => {
            console.log('reload')
          })
        });
    }
  },
  created() {

      this.getData();

      chrome.runtime.onMessage.addListener( (msg) => {
        if (msg.action === 'update') {
            this.getData();
        }
    });

  }
}
</script>

