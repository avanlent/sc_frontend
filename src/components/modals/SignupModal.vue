<template>
  <modal-template title="Sign up" :open="open" @show="showChange($event)" @close="closeClick">
    <div>
      <a-form-model class="signupmodal" >
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
        <a-form-model-item label="Email" :validateStatus="emailStatus">
          <a-input v-model="email" placeholder="enter email" @keydown.enter.prevent.stop="submit" />
        </a-form-model-item>
        <a-form-model-item label="Password" :validateStatus="passwordStatus">
          <a-input-password v-model="password" type="password" placeholder="enter password" @keydown.enter.prevent.stop="submit" />
        </a-form-model-item>
        <a-form-model-item :style="{ marginTop: '15px' }">
          <a-button type="primary" block @click="submit" :loading="loading">Submit</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </modal-template>
</template>

<script>
import ModalTemplate from './ModalTemplate';
import { EventBus } from '../../event-bus';

export default {
    name: 'SignupModal',
    components: {
      ModalTemplate
    },
    data() {
        return {
            username: '',
            email: '',
            password: '',
            errors: [],
            usernameStatus: null,
            emailStatus: null,
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
            EventBus.$emit('signup-modal-' + name, payload);
          else
            EventBus.$emit('signup-modal-' + name);
        },
        closeClick() {
          this.emit('closeClick')
        },
        validUsername(username) {
          var re = /^([A-Za-z0-9_-]+)$/;
          return re.test(username);
        },
        validEmail(email) {
          var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
        },
        invalidPassword(password) {
          if (this.username && password == this.username) {
            return "Password cannot be the same as username";
          }
          if (this.email && password == this.email) {
            return "Password cannot be the same as email";
          }
          if (password.length < 8) {
            return "Password must be at least 8 characters long"
          }
          if (password.length > 128) {
            return "Password cannot exceed 128 characters"
          }
          return false;
        },
        showChange(e) {
          this.$emit('show', e);
          this.username = '';
          this.email = '';
          this.password = '';
          this.errors = [];
          this.usernameStatus = null;
          this.emailStatus = null;
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
              if(!this.validUsername(this.username)){
                this.errors.push('Username can only be letters, numbers, underscores, or dashes')
                this.usernameStatus = "error"
              } else {
                this.usernameStatus = null
              }
            }
            if(!this.email) {
              this.errors.push('Email required')
              this.emailStatus = "error"
            } else {
              if(!this.validEmail(this.email)) {
              this.errors.push('Invalid email')
              this.emailStatus = "error"
              } else {
                this.emailStatus = null
              }
            }
            if(!this.password) {
              this.errors.push('Password required')
              this.passwordStatus = "error"
            } else {
              var invalid = this.invalidPassword(this.password)
              if(invalid) {
                this.errors.push(invalid)
                this.passwordStatus = "error"
              } else {
                this.passwordStatus = null
              }
            }

            if(!this.errors.length) {
              var user = {};
              user.password = this.password;
              user.username = this.username;
              user.email = this.email;
              this.$store.dispatch('user/signup', user).then(() => {
                this.username = null;
                this.password = null;
                this.email = null;
                this.usernameStatus = null;
                this.passwordStatus = null;
                this.emailStatus = null;
                this.emit('success');
              }).catch((err) => {
                if ((err.response && err.response.data.problem)) {
                  if (err.response.data.problem == 'already_taken') {
                    if (err.response.data.isUsernameTaken) {
                      this.errors.push('Username already in use')
                      this.usernameStatus = "error"
                    }
                    if (err.response.data.isEmailTaken) {
                      this.errors.push('Email already in use')
                      this.emailStatus = "error"
                    }
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

.signupmodal {
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