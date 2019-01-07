<template>
  <v-app>
    <v-content>
      <component  v-on:login="login" :is="selectComponent" v-if="selectComponent"></component>
    </v-content>
  </v-app>
</template>

<script>
import Auth from './components/auth'
import Base from './components/base'

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
    if (typeof(localStorage.hook) != 'undefined' && typeof(localStorage.baseUrl) != 'undefined') {
      this.selectComponent = 'Base';
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
