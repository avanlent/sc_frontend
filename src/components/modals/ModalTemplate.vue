<template>
    <Modal v-model="show" :enableClose="false" :modalStyle="{ borderRadius: '4px', overflow: 'hidden' }" :baseZindex="11">
        <div class="titlebar" slot="titlebar">
            <h3 class="title">
                {{ title }}
            </h3>
            <a :href="$route.path" @click.prevent.stop class="close-container">
                <eva-icon name="close-outline" class="close" @click="$emit('close')" width="30" height="30"></eva-icon>
            </a>
        </div>
        <div>
            <slot></slot>
        </div>
    </Modal>
</template>

<script>
import { EvaIcon } from 'vue-eva-icons'

export default {
    name: "ModalTemplate",
    components: {
        [EvaIcon.name]: EvaIcon,
    },
    data() {
        return {
            show: false,
        }
    },
    model: {
        prop: 'open',
        event: 'show'
    },
    props: {
        title: {
            type: String,
            dfault: ''
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.$watch('open', function(newVal) {
            this.show = newVal;
        })
        this.$watch('show', function(newVal) {
            this.$emit('show', newVal);
        })
    },
}
</script>

<style lang="scss" scoped>
.titlebar {
  background-color: $base-color;
  border-bottom: 1px solid $light;
  box-shadow: 0 1px 3px rgba(200, 200, 200, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  .title{
    padding: 0;
    margin: 0;
  }
  .close-container{
    margin-left: auto;
    padding: 0;
    fill: red;
    .close {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        &:hover {
            transform: scale(1.1, 1.1);
        }
        &:active {
            transform: scale(0.9, 0.9);
        }
    }
  }
}
</style>