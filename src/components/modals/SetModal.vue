<template>
  <modal-template title="New Set" :open="open" @show="showChange($event)" @close="closeClick" >
    <div>
      <a-form-model class="setmodal" >
        <div class="head">
          <img src="../../assets/logo.png" width="100px" height="100px" />
        </div>
        <div class="error" v-if="errors.length">
          <ul class="errors">
            <li class="item" v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <a-form-model-item label="Set Name" :validateStatus="nameStatus">
          <a-input v-model="setName" placeholder="enter set name" :disabled="loading" @keydown.enter.prevent.stop="submit" />
        </a-form-model-item>
        <a-form-model-item label="Set Description" :validateStatus="descriptionStatus">
          <a-textarea v-model="setDescription" placeholder="enter set description" :disabled="loading" />
        </a-form-model-item>
        <a-form-model-item>
          <a-checkbox v-model="setPrivate" :disabled="loading">Make the set private?</a-checkbox>
        </a-form-model-item>
        <a-form-model-item :style="{ marginTop: '15px' }">
          <a-button type="primary" block @click="submit" :loading="loading">Submit</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </modal-template>
</template>

<script>
import SetService from '../../services/set.service';
import ModalTemplate from './ModalTemplate';
import { EventBus } from '../../event-bus';

export default {
    name: 'SetModal',
    components: {
      ModalTemplate
    },
    data() {
        return {
            loading: false,
            submitting: false,
            setName: '',
            setDescription: '',
            setPrivate: false,
            errors: [],
            nameStatus: null,
            descriptionStatus: null,
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
      },
      set: {
        type: Object
      }
    },
    methods: {
        emit(name, payload) {
          if (payload)
            EventBus.$emit('set-modal-' + name, payload);
          else
            EventBus.$emit('set-modal-' + name);
        },
        closeClick() {
          this.emit('closeClick')
        },
        showChange(e) {
          this.$emit('show', e);
          this.setName = '';
          this.setDescription = '';
          this.setPrivate = false;
          this.errors = [];
          this.nameStatus = null;
          this.descriptionStatus = null;
          this.loading = false;
          this.submitting = false;
        },
        submit() {
            if (this.submitting) return;
            this.submitting = true;
            this.errors = [];
            if(!this.setName) {
              this.errors.push('Set name required')
              this.nameStatus = "error"
            } else {
              if (this.setName.length > 32) {
                this.errors.push('Set name cannot exceed 32 characters')
                this.nameStatus = "error"
              } else {
                this.nameStatus = null;
              }
            }

            if(this.setDescription.length > 1024) {
              this.errors.push('Set description cannot exceed 1024 characters')
              this.descriptionStatus = "error"
            } else {
              this.descriptionStatus = null
            }

            if(!this.errors.length) {
              this.loading = true;
              var newSet = {};
              newSet.name = this.setName;
              newSet.public = !this.setPrivate;
              if (this.setDescription) newSet.description = this.setDescription;
              SetService.addSet(newSet).then((set) => {
                this.emit('success', set);
              }).catch(() => {
                this.emit('failure');
              }).finally(() => {
                this.loading = false;
                this.submitting = false;
              });
            } else {
              this.submitting = false;
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.ant-form-item {
  margin-bottom: 7px;
}

.setmodal {
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