<template>
  <modal-template :title="card ? 'Edit Card' : 'New Card'" :open="open" @show="showChange($event)" @close="closeClick">
    <div>
      <a-form-model class="cardmodal" @submit.prevent.stop >
        <div class="head">
          <img src="../../assets/logo.png" width="100px" height="100px" />
        </div>
        <div class="error" v-if="errors.length">
          <ul class="errors">
            <li class="item" v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <a-form-model-item label="Kanji" :validateStatus="kanjiStatus">
          <a-input v-model="kanji" placeholder="enter kanji" :disabled="loading" @keydown.enter.prevent.stop="submit" />
        </a-form-model-item>
        <a-form-model-item label="Kana" :validateStatus="kanaStatus">
          <a-input v-model="kana" placeholder="enter kana" :disabled="loading" @keydown.enter.prevent.stop="submit" />
        </a-form-model-item>
        <a-form-model-item label="Description" :validateStatus="descriptionStatus">
          <a-textarea v-model="description" placeholder="enter description" :disabled="loading" />
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
import setService from '../../services/set.service';

export default {
    name: 'CardModal',
    components: {
      ModalTemplate
    },
    data() {
        return {
            loading: false,
            submitting: false,
            kana: '',
            kanji: '',
            description: '',
            errors: [],
            kanjiStatus: null,
            kanaStatus: null,
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
      card: {
        type: Object
      },
      setId: {
        type: String
      }
    },
    methods: {
      emit(name, payload) {
        if (payload)
          EventBus.$emit('card-modal-' + name, payload);
        else
          EventBus.$emit('card-modal-' + name);
      },
      resetData() {
        this.loading = false;
        this.submitting = false;
        this.kanji = '';
        this.kana = '';
        this.description = '';
        this.errors = [];
        this.kanjiStatus = null;
        this.kanaStatus = null;
        this.descriptionStatus = null;
      },
      closeClick() {
        this.emit('closeClick')
      },
      showChange(e) {
        this.resetData();
        if (this.card) {
          if (this.card.kanji) this.kanji = this.card.kanji;
          if (this.card.kana) this.kana = this.card.kana;
          if (this.card.description) this.description = this.card.description;
        }
        this.$emit('show', e);
      },
      submit() {
        if (this.submitting) return;
        this.submitting = true;
        this.errors = [];
        if (this.kanji.length > 32) {
          this.errors.push('Kanji cannot exceed 32 characters')
          this.kanjiStatus = "error"
        } else {
          this.kanjiStatus = null;
        }

        if (this.kana.length > 32) {
          this.errors.push('Kana cannot exceed 32 characters')
          this.kanaStatus = "error"
        } else {
          this.kanaStatus = null;
        }

        if(this.description.length > 256) {
          this.errors.push('Description cannot exceed 256 characters')
          this.descriptionStatus = true
        } else {
          this.descriptionStatus = null
        }

        var num = 0;
        if (this.description) num++;
        if (this.kanji) num++;
        if (this.kana) num++;
        if (num < 2) {
          this.errors.push('At least two (2) fields required');
        }

        if(!this.errors.length) {
          this.loading = true;
          var newCard = {};
          if (this.kanji) newCard.kanji = this.kanji;
          if (this.kana) newCard.kana = this.kana;
          if (this.description) newCard.description = this.description;

          if (this.setId) {
            setService.addCard(this.setId, newCard).then((set) => {
              this.emit('success', set)
            }).catch(() => {
              this.emit('failure')
            }).finally(() => {
              this.loading = false;
              this.submitting = false;
            });
          } else {
            if (this.card) {
              Object.keys(this.card).forEach((key) => {
                if (!['kanji', 'kana', 'description'].includes(key)) {
                  newCard[key] = this.card[key];
                }
              });
            }
            this.emit('success', newCard)
            this.loading = false;
            this.submitting = false;
          }
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

.cardmodal {
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
  .input {
    margin-top: 10px;
    .item {
      & + .item {
        margin-top: 20px;
      }
    }
  }
}
</style>