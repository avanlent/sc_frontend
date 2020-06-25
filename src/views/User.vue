<template>
  <div id="userpage">
    <set-modal v-model="showAddSet" />
    <div class="content">
      <div class="infobar">
        <a-spin v-if="loading">
          <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        </a-spin>
        <div v-else class="info">
          <div v-if="sets.length > 0">Personal Sets</div>
          <div v-else>It looks like you have no sets. <br /><a @click.prevent.stop="showAddSet = true">Click me</a> to add one!</div>
        </div>
      </div>
      <div class="cards-container">
        <div class="cards" :class="{ lowCount: sets.length < 2 }">
          <set-card v-for="(set, i) in sets" :key="i" :set="set" allowMods 
            @remove="removeSet($event)" 
            @viewClick="$router.push('/set/' + $event)"
            @studyClick="$router.push('/study/' + $event)"
            @edit="$router.push('/edit/' + $event)" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SetService from '../services/set.service'
import SetCard from '../components/SetCard'
import SetModal from '../components/modals/SetModal'
import { EventBus } from '../event-bus';

export default {
  name: 'user',
  components: {
    SetCard,
    SetModal
  },
  data() {
    return {
      showAddSet: false,
      loading: true,
      sets: []
    }
  },
  methods: {
    setAdded(set) {
      this.showAddSet = false;
      this.sets.push(set);
    },
    removeSet(id) {
      SetService.removeSet(id).then(() => {
        this.$message.success('Set deleted succcessfully');
        this.sets = this.sets.filter(item => item.id != id);
      }).catch(() => {
        this.$message.warn('Set not removed')
      });
    },
    fetchSets() {
      this.loading = true;
      SetService.getAllUserSets().then((sets) => {
        this.sets = sets;
      }).catch((errs) => {
        console.log(errs)
      }).finally(() => {
        this.loading = false;
      })
    }
  },
  mounted() {
    if (!this.$store.getters['user/isLoggedIn']) {
      this.$router.replace('/unauthorized')
    } else {
      this.fetchSets();
      EventBus.$on('set-modal-success', (e) => {
        this.setAdded(e);
      });
    }
  },
  beforeDestroy() {
    EventBus.$off('set-modal-success');
    EventBus.$emit('user-remove-set-modal-success-listener');
  },
}
</script>

<style lang="scss" scoped>
#userpage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.content {
  width: 100%;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  .infobar {
    font-size: 2em;
    margin: 10px 0;
    padding: 0 10px;
  }
}
.cards-container {
  .cards {
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(1, 1fr);
    /* Desktop */
    @media only screen and (min-width: $mobile-width) {
      & {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      }
      &.lowCount {
        grid-template-columns: repeat(auto-fit, minmax(400px, 500px));
      }
    }
  }
}
</style>