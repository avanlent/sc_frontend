<template>
  <div id="setcard">
      <div class="head">
        <div class="name">{{ set.name }}</div>
        <div v-if="allowMods" class="mods">
          <eva-icon name="edit" fill="#4a4a4a" width="21" height="21" @click="$emit('edit', set.id)" class="mod" ></eva-icon>
          <a-popconfirm
            title="Confirm delete set."
            ok-text="Yes"
            cancel-text="No"
            @confirm="$emit('remove', set.id)"
            placement="bottomRight"
          >
            <eva-icon name="trash-outline" fill="#FF2F2F" width="20" height="20" class="mod"></eva-icon>
          </a-popconfirm>
        </div>
      </div>
      <div class="body">
        <div v-if="set.description" class="desc">{{ set.description }}</div>
        <div v-else class="desc" :style="{color: '#b3b3b3'}">No description</div>
        <div class="options">
          <div class="count">{{ count }}{{ publicStatus }}</div>
          <div class="item view">
            <a-button type="default" @click="$emit('viewClick', set.id)"><a-icon type="bars" />View</a-button>
          </div>
          <div class="item study">
            <a-button type="default" @click="$emit('studyClick', set.id)"><a-icon type="caret-right" />Study</a-button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'SetCard',
  props:{
    set: {
      type: Object
    },
    allowMods: {
      type: Boolean
    }
  },
  computed: {
    count() {
      if (this.set.numCards == 0) {
        return 'No cards'
      } else if (this.set.numCards == 1) {
        return '1 card'
      } else {
        return this.set.numCards + ' cards'
      }
    },
    publicStatus() {
      if (Object.prototype.hasOwnProperty.call(this.set, "public")) {
        return this.set.public ? ', public' : ', private';
      } else {
        return '';
      }
    }
  },
}
</script>

<style lang="scss" scoped>
#setcard {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.4);
  background-color: $white;
  display: flex;
  flex-direction: column;
  /* Desktop */
  @media only screen and (min-width: $mobile-width) {
    &:hover {
      box-shadow: 0 0 5px 0 rgba(0,0,0,0.5);
    }
  }
  .head {
    font-size: 1.4em;
    padding: 5px;
    background-color: $base-color;
    border-bottom: 1px solid $light;
    box-shadow: 0 1px 3px rgba(200, 200, 200, 0.5);
    position: relative;
    .name {
      margin-right: 65px;
      padding-left: 15px;
      text-align: start;
    }
    .mods {
      position: absolute;
      top: 5px;
      right: 7px;
      .mod {
        cursor: pointer;
        height: 28px;
        width: 28px;
        border-radius: 4px;
        background-color: rgba(0,0,0,0.22);
        margin-left: 4px;
        padding: 2px 0 0 0;
      }
    }
  }
  .body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .desc {
      margin: 10px 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: start;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3; /* number of lines to show */
    }
    .options {
      margin-top: auto;
      display: flex;
      .view {
        margin-left: auto;
        margin-bottom: 3px;
      }
      .study {
        margin: 0 3px 3px 5px;
      }
      .count {
        align-self: flex-end;
        font-size: 0.85em;
        margin: 0 2px 4px 5px;
      }
    }
  }
}
</style>