<template>
<div>
  <signin-modal v-model="showSignin" />
  <signup-modal v-model="showSignup" />
  <set-modal v-model="showAddSet" />

  <header id="navbar">
    <nav id="nav-head">
      <div class="nav-title">
        <div class="content" @click.prevent.stop="go('/')">
          Sancard
        </div>
      </div>
      <div v-if="!narrowWindow" class="nav-menu">
        <slot v-if="isLoggedIn">
          <div class="item">
            <div class="icontext" @click="newSet">
              <eva-icon name="plus" width="20" height="20" class="icon"></eva-icon>
              <div class="text">Add Set</div>
            </div>
          </div>
          <div class="item" @click="go('/user')">
            <div class="icontext">
              <eva-icon name="layers" width="20" height="20" class="icon"></eva-icon>
              <div class="text">My Sets</div>
            </div>
          </div>
          <div class="item">
            <a-dropdown placement="bottomRight">
              <a-avatar icon="user" :style="{ backgroundColor: '#478d73' }" />
              <a-menu slot="overlay">
                <a-menu-item><div @click="go('/user')">{{ username }}</div></a-menu-item>
                <a-menu-item><div @click="logout">Log out</div></a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </slot>
        <slot v-else>
          <div class="item" @click="signup">
            <div class="icontext">
              <eva-icon name="person-add-outline" width="20" height="20" class="icon"></eva-icon>
              <div class="text">Sign up</div>
            </div>
          </div>
          <div class="item" @click="signin">
            <div class="icontext">
              <eva-icon name="person-outline" width="20" height="20" class="icon"></eva-icon>
              <div class="text">Sign in</div>
            </div>
          </div>
        </slot>
      </div>
      <div v-else class="nav-btn">
        <burger-button :active="openMenu" @click="openMenu = !openMenu" :bar-width="30" :bar-height="5" bar-color="#a7ffe8" />
      </div>
    </nav>
    <transition-expand v-if="narrowWindow">
      <nav v-show="openMenu" id="nav-expand">
        <div class="divider"></div>
        <div class="nav-menu">
          <slot v-if="isLoggedIn">
            <a href="/" @click.prevent.stop="newSet">
              <div class="item">
                <div class="icontext">
                  <eva-icon name="plus" width="30" height="30" class="icon"></eva-icon>
                  <div class="text">Add Set</div>
                </div>
              </div>
            </a>
            <a href="/" @click.prevent.stop="go('/user')">
              <div class="item">
                <div class="icontext">
                  <eva-icon name="layers" width="30" height="30" class="icon"></eva-icon>
                  <div class="text">My Sets</div>
                </div>
              </div>
            </a>
            <a href="/" @click.prevent.stop="logout">
              <div class="item">
                <div class="icontext">
                  <eva-icon name="person-remove-outline" width="30" height="30" class="icon"></eva-icon>
                  <div class="text">Log out</div>
                </div>
              </div>
            </a>
          </slot>
          <slot v-else>
            <a href="/" @click.prevent.stop="signup">
              <div class="item">
                <div class="icontext">
                  <eva-icon name="person-add-outline" width="30" height="30" class="icon"></eva-icon>
                  <div class="text">Sign up</div>
                </div>
              </div>
            </a>
            <a href="/" @click.prevent.stop="signin">
              <div class="item">
                <div class="icontext">
                  <eva-icon name="person-outline" width="30" height="30" class="icon"></eva-icon>
                  <div class="text">Sign in</div>
                </div>
              </div>
            </a>
          </slot>
        </div>
      </nav>
    </transition-expand>
  </header>
</div>
</template>

<script>
import BurgerButton from 'vue-burger-button';
import TransitionExpand from './TransitionExpand'
import { EvaIcon } from 'vue-eva-icons'
import SigninModal from  './modals/SigninModal'
import SignupModal from './modals/SignupModal'
import SetModal from './modals/SetModal'
import vars from '../vars'
import { EventBus } from '../event-bus';

export default {
  name: 'NavBar',
  components: {
    BurgerButton,
    TransitionExpand,
    [EvaIcon.name]: EvaIcon,
    SigninModal,
    SignupModal,
    SetModal
  },
  data() {
    return {
      openMenu: false,
      narrowWindow: true,
      showSignin: false,
      showSignup: false,
      showAddSet: false,
    }
  },
  methods: {
    onResize(event) {
      this.menuChanger(event.target.innerWidth, vars.mobileWidth);
    },
    menuChanger(width, changeWidth) {
      if ((width < changeWidth) != this.narrowWindow) {
        this.openMenu = false;
        this.narrowWindow = !this.narrowWindow;
      }
    },
    logout() {
      this.openMenu = false;
      this.$store.dispatch('user/logout');
      if (this.$route.path != '/') {
        this.$router.push('/')
      }
      this.$message.info('Logged out', 1)
    },
    go(path) {
      this.openMenu = false;
      if (this.$route.path != path) {
        this.$router.push(path);
      }
    },
    blockModal() {
      return this.showSignin || this.showSignup || this.showAddSet;
    },
    signin() {
      if (this.blockModal()) return;
      this.showSignin = true;
    },
    signup() {
      if (this.blockModal()) return;
      this.showSignup = true;
    },
    newSet() {
      if (this.blockModal()) return;
      this.showAddSet = true;
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['user/isLoggedIn'];
    },
    username() {
      return this.$store.state.user.username;
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize, { passive: true });
    this.menuChanger(window.innerWidth, vars.mobileWidth); //initialize menu

    EventBus.$on('set-modal-closeClick', () => this.showAddSet = false );
    EventBus.$on('signup-modal-closeClick', () => this.showSignup = false );
    EventBus.$on('signin-modal-closeClick', () => this.showSignin = false );

    EventBus.$on('set-modal-success', () => {
      this.showAddSet = false;
      this.go('/user')
    });
    EventBus.$on('user-remove-set-modal-success-listener', () => {
      EventBus.$on('set-modal-success', () => {
        this.showAddSet = false;
        this.go('/user')
      });
    });
    EventBus.$on('signin-modal-success', () => {
      this.showSignin = false;
      this.$message.info('Signed in', 1)
    });
    EventBus.$on('signup-modal-success', () => {
      this.showSignup = false;
      this.$message.success('Account created', 1)
      this.go('/')
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    EventBus.$off();
  }
}
</script>

<style lang="scss" scoped>
#navbar {
  background-color: $base-color;
  overflow: hidden;
  display: block;
  margin-bottom: 0;
  border-bottom: 1px solid $light;
  box-shadow: 0 1px 3px rgba(200, 200, 200, 0.7);
  font-size: 1.3em;
}
.nav-title:hover {
  cursor: pointer;
}
#nav-head {
  display: flex;
  min-height: 50px;
  max-height: 70px;
  padding: 5px 15px;
  > * {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nav-title {
    .content {
      font-size: 1.5em;
    }
  }
  .nav-menu{
    margin-right: 5px;
    margin-left: auto;
    .item {
      cursor: pointer;
      & + .item {
        margin-left: 20px;
      }
      .icontext {
        display: flex;
        > * {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease-out;
        }
        .icon {
          transition-delay: 0.02s;
          margin-right: 2px;
        }
        &:hover {
          > * {
            color: $light;
            fill: $light;
            transition: all 0.05s ease-in;
          }
          .icon {
            transition-delay: 0.02s;
          }
        }
      }
    }
  }
  .nav-btn{
    margin-right: 5px;
    margin-left: auto;
  }
}
#nav-expand {
  .divider {
    width: 95%;
    height: 0;
    border-top: 2px solid $highlight-color;
    border-radius: 5px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 3px;
  }
  .nav-menu {
    font-size: large;
    .item {
      padding: 10px 20px;
      .icontext {
        display: flex;
        > * {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon {
          margin-right: 2px;
        }
        .text {
          color: $dark;
        }
      }
    }
  }
}
</style>
