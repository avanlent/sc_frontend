<template>
  <div id="homepage">
    <div class="content">
      <div class="searchbar">
        <a-input-search placeholder="search for a set" v-model="search" enter-button @search="onSearch" />
      </div>
      <div class="infobar">
        <a-spin v-if="loading">
          <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        </a-spin>
        <div v-else class="info">
          {{ info }}
        </div>
      </div>
      <div class="cards-container">
        <div class="cards" :class="{ lowCount: sets.length < 2 }">
          <set-card v-for="(set, i) in sets" :key="i" :set="set" @viewClick="$router.push('/set/' + $event)" @studyClick="$router.push('/study/' + $event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SetService from '../services/set.service'
import SetCard from '../components/SetCard'

export default {
  name: 'Home',
  components: {
    SetCard
  },
  data() {
    return {
      search: '',
      noResults: false,
      loading: false,
      sets: []
    }
  },
  methods: {
    fetchSets(query) {
      this.noResults = false;
      this.loading = true;
      this.sets = [];
      if (query) {
        SetService.getSetsBySearch(query, 0, 50).then((sets) => {
          this.sets = sets;
        }).catch((errs) => {
          if (errs[0].code == 301) {
            this.noResults = true;
          }
        }).finally(() => {
          this.loading = false;
        });
      } else {
        SetService.getEndorsedSets().then((sets) => {
          this.sets = sets;
        }).catch(() => {
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    onSearch() {
      if (this.search) {
        this.$router.push('/search?q=' + this.search);
        this.search = '';
      }
    }
  },
  computed: {
    query() {
      return this.$route.query.q;
    },
    info() {
      if (this.query) {
        if (this.noResults) {
          return 'No results for: ' + this.query
        } else {
          return 'Results for: ' + this.query
        }
      } else {
        return 'Endorsed Sets'
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.fetchSets(to.query.q);
    next();
  },
  beforeRouteLeave (to, from, next) {
    this.fetchSets(to.query.q);
    next();
  },
  mounted() {
    this.fetchSets(this.query);
  },

}
</script>

<style lang="scss" scoped>
#homepage {
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
  .searchbar {
    margin: auto;
    width: 100%;
    max-width: 700px;
  }
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

.options {
  margin-top: 20px;
  .button {
    /* Desktop */
    @media only screen and (min-width: $mobile-width) {
      & {
        max-width: 600px;
      }
    }
  }

}

</style>
