<template>
  <modal-template title="Sign In" :open="open" @show="showChange($event)" @close="closeClick" >
    <div>
      <a-form-model class="signinmodal" >
        <div class="head">
          <img src="../../assets/logo.png" width="100px" height="100px" />
        </div>
        <div class="error" v-if="errors.length">
          <ul class="errors">
            <li class="item" v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <a-form-model-item label="Username" :validateStatus="usernameStatus">
          <a-input v-model="username" placeholder="enter username" @keydown.enter.prevent.stop="submit" />
        </a-form-model-item>
        <a-form-model-item label="Password" :validateStatus="passwordStatus">
          <a-input-password v-model="password" type="password" placeholder="enter password" @keydown.enter.prevent.stop="submit" />
        </a-form-model-item>
        <a-form-model-item :style="{ marginTop: '15px' }">
          <a-button type="primary" block @click.prevent.stop="submit" :loading="loading">Submit</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </modal-template>
</template>

<script>
import ModalTemplate from './ModalTemplate';
import { EventBus } from '../../event-bus';

export default {
    name: 'SigninModal',
    components: {
      ModalTemplate
    },
    data() {
        return {
            username: '',
            password: '',
            errors: [],
            usernameStatus: null,
            passwordStatus: null,
            submitting: false,
        }
    },
    model: {
        prop: 'open',
        event: 'show'
    },
    props: {
      open: {
        type: Boolean,
        default: false
      }
    },
    methods: {
        emit(name, payload) {
          if (payload)
            EventBus.$emit('signin-modal-' + name, payload);
          else
            EventBus.$emit('signin-modal-' + name);
        },
        closeClick() {
          this.emit('closeClick')
        },
        showChange(e) {
          this.$emit('show', e);
          this.username = '';
          this.password = '';
          this.errors = [];
          this.usernameStatus = null;
          this.passwordStatus = null;
          this.submitting = false;
        },
        submit() {
            if (this.submitting) return;
            this.submitting = true;
            this.errors = [];
            if(!this.username) {
              this.errors.push('Username required')
              this.usernameStatus = "error"
            } else {
              this.usernameStatus = null
            }
            if(!this.password) {
              this.errors.push('Password required')
              this.passwordStatus = "error"
            } else {
              this.passwordStatus = null
            }

            if(!this.errors.length) {
              var user = {};
              user.password = this.password;
              user.username = this.username;
              this.$store.dispatch('user/login', user).then(() => {
                this.username = null;
                this.password = null;
                this.usernameStatus = null
                this.passwordStatus = null
                this.emit('success');
              }).catch((err) => {
                if ((err.response && err.response.data.problem)) {
                  if (err.response.data.problem == 'no_user') {
                    this.errors.push('User not found')
                    this.usernameStatus = "error"
                  }
                  if (err.response.data.problem == 'bad_password') {
                    this.errors.push('Incorrect password')
                    this.passwordStatus = "error"
                  }
                } else {
                  if (!err.response) {
                    this.errors.push('Our services our down at the moment. Please try again later')
                  } else {
                    this.errors.push('Something happened on our end. Please try again')
                  }
                }
                this.emit('failure');
              }).finally(() => {
                this.submitting = false;
              });
            } else {
              this.submitting = false;
            }
        },
    },
    computed: {
      loading() {
        return this.$store.getters['user/isLoading'];
      },
    },
}
</script>

<style lang="scss" scoped>
.ant-form-item {
  margin-bottom: 7px;
}

.signinmodal {
  .head {
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .error {
    margin-top: 10px;
      * {
          color: red;
      }
      .errors {
          font-size: small;
          list-style-position: inside;
          margin: 0;
          padding: 0;
      }
  }
}
</style>