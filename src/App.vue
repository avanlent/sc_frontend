<template>
  <div id="app" v-if="this.$store.state.user.appReady">
    <div class="navbar-container">
      <nav-bar />
    </div>
    <div id="content-container">
      <router-view/>
    </div>
    <div id="footer-container" :class="{ push: pushFooter }" >
      <footer-bar />
    </div>
  </div>
  <div id="app" v-else>
    <a-spin>
      <a-icon slot="indicator" type="loading" style="font-size: 50px; marginTop: 20px" spin />
    </a-spin>
  </div>
</template>

<script>
import NavBar from  './components/NavBar'
import FooterBar from './components/FooterBar'

export default {
  components: {
    NavBar,
    FooterBar,
  },
  data() {
    return {
      showPassReq: false
    }
  },
  computed: {
    pushFooter() {
      return this.$route.name === "Study"
    }
  },
}
</script>

<style lang="scss">
* {
    font-family: 'Poppins', 'Kosugi', 'M PLUS Rounded 1c', 'M PLUS 1p', 'Sawarabi Mincho', Helvetica, Arial, sans-serif !important;
}

html, body {
  padding: 0;
  margin: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;

  #navbar-container, #footer-container {
    flex: none;
  }

  #content-container {
    flex: 1;
  }

  #footer-container.push {
    height: 8px;
  }

}
</style>
