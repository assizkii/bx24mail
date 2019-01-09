<template>
  <v-app>
    <v-content>
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
    }
  }
}
</script>
