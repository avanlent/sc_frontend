<template>
  <div id="studypage">
    <div class="cardviewer-container" v-if="!loading && !hasError">
      <div class="cardviewer" v-if="cards.length">

        <div class="head">
          <div class="selector">
              <div v-for="(value, i) in sequence" :key="i" @click="goTo(value, '180deg')" :class="[activeChooser(value), value]" class="option">
                <div>{{ keyIcon[value] }}</div>
              </div>
          </div>
          <div class="title">
            <div class="text" @click="$router.push('/set/' + setId)">{{ setName }}</div>
          </div>
        </div>

        <div class="card-container" v-touch:swipe.left="$isMobile() ? nextCard : null" v-touch:swipe.right="$isMobile() ? prevCard : null">
          <div class="dummyText" v-if="!isImg(frontKey)">
              <p v-if="isImg" :class="frontKey">{{ front }}</p>
          </div>
          <div class="card">
            <div class="content" ref="card">
              <div class="front side">
                <div v-if="isImg(frontKey)" class="img-container">
                    <img :src="getImg(frontKey)">
                </div>
                <p v-else :class="frontKey">{{ front }}</p>
              </div>
              <div class="back side">
                <div v-if="isImg(backKey)" class="img-container">
                    <img :src="getImg(backKey)">
                </div>
                <p v-else :class="backKey">{{ back }}</p>
              </div>
            </div>
          </div>
          <div class="left half" @click="flipNext"></div>
          <div class="right half" @click="flipPrev"></div>
        </div>

        <div class="navigator">
          <div class="item left" @click="prevCard">&lt;&lt;</div>
          <div class="item mid">{{ cardSelect+1 + " / " + cards.length }}</div>
          <div class="item right" @click="nextCard">&gt;&gt;</div>
        </div>
      </div>
      <div v-else>
        <h2>This set has no cards.</h2>
      </div>
    </div>
    <div v-else>
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size: 50px" spin />
      </a-spin>
    </div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';
import SetService from '../services/set.service';

export default {
  name: 'Study',
  data() {
    return {
      cards: [
        // { kanji: 'kanji0', kana: 'kana0', description: 'desc0' },
        // { kanji: 'kanji1', kana: 'kana1', description: 'desc1' },
        // { kanji: 'kanji2', kana: 'kana2', description: null },
        // { kanji: 'kanji3', kana: null, description: 'desc3' },
        // { kanji: null, kana: 'kana4', description: 'desc4' },
      ],
      setName: '',
      setId: '',
      cardSelect: 0,
      backKey: "",
      frontKey: "",
      animatingFlip: false,
      animatingLeave: false,
      loading: true,
      hasError: false,
      keyIcon: {
        "kanji": '字',
        "kana": 'カ',
        "description": 'A'
      },
    }
  },
  methods: {
    loadCards() {
      SetService.getSetById(this.setId).then((set) => {
          this.cards = set.cards;
          this.setName = set.name;
      }).catch((errs) => {
          this.hasError = true;
          switch (errs[0].code) {
              case 302: case 206: this.$router.replace('/404'); break;
              case 106: case 108: this.$router.replace('/unauthorized'); break;
              default: this.$message.error('An error has occured'); this.$router.go(-1); break;
          }
      }).finally(() => {
        this.frontKey = this.sequence[0];
        this.backKey = this.sequence[1];
        this.cardSelect = 0;
        this.loading = false;
      });
    },
    goTo(key, dir) {
      if (this.animatingFlip) return;
      if (key === this.frontKey) return;
      this.animatingFlip = true;
      this.backKey = key;
      var el = this.$refs.card;
      var vm = this;
      Velocity(el, {rotateY: dir}, 
        {duration: 200, complete: function(){
          Velocity(el, {rotateY: '0deg'}, 
            {duration: 0, complete: function(){
              vm.frontKey = key;
              vm.animatingFlip = false;
            }
          });
        }
      });
    },
    mod(n, m) {
      return ((n % m) + m) % m;
    },
    flipNext() {
      if (this.animatingFlip) return;
      var next = this.mod((this.sequence.indexOf(this.frontKey)-1), this.sequence.length);
      this.goTo(this.sequence[next], '180deg');
    },
    flipPrev() {
      if (this.animatingFlip) return;
      var next = this.mod((this.sequence.indexOf(this.frontKey)+1), this.sequence.length);
      this.goTo(this.sequence[next], '-180deg');
    },
    activeChooser(val) {
      if (this.animatingFlip) {
        if (val === this.backKey)
          return 'active';
        else
          return null;
      } else {
        if (val === this.frontKey)
          return 'active';
        else
          return null;
      }
    },
    nextCard() {
      if (this.animatingLeave) return;
      this.animatingLeave = true;
      var el = this.$refs.card
      var vm = this;
      Velocity(el, {translateX: "-200px", opacity: "0"}, 
        {duration: 50, complete: function(){
          Velocity(el, {translateX: '100px'}, 
            {duration: 0, complete: function(){
              vm.cardSelect = vm.mod(vm.cardSelect+1, vm.cards.length);
              vm.$nextTick(() => {
                vm.frontKey = vm.sequence[0];
              })
              Velocity(el, {translateX: '0px', opacity: "1"}, 
                {duration: 100, complete: function(){
                  vm.animatingLeave = false;
                }
              })
            }
          })
        }
      })
    },
    prevCard() {
      if (this.animatingLeave) return;
      this.animatingLeave = true;
      var el = this.$refs.card
      var vm = this;
      Velocity(el, {translateX: "200px", opacity: "0"}, 
        {duration: 50, complete: function(){
          Velocity(el, {translateX: '-100px'}, 
            {duration: 0, complete: function(){
              vm.cardSelect = vm.mod(vm.cardSelect-1, vm.cards.length);
              vm.$nextTick(() => {
                vm.frontKey = vm.sequence[0];
              })
              Velocity(el, {translateX: '0px', opacity: "1"}, 
                {duration: 100, complete: function(){
                  vm.animatingLeave = false;
                }
              })
            }
          })
        }
      })
    },
    isImgDesc(desc) {
      // https://external-content.duckduckgo.com/iu/?u=
      // var re = /^\[img\]\(.*\.(jpg|JPG|png|PNG|gif|GIF)\)$/;
      // var re = /^\[img\]\(([^)]+)\.(jpg|png|gif|JPG|PNG|GIF)\)$/;
      var re = /^\[img\]\(.*\)$/;
      return re.test(desc);
    },
    isImg(key) {
      var re = /^\[img\]\(([^)]+)\)$/;
      return re.test(this.cardData[key]);
    },
    getImg(key) {
      var re = /^\[img\]\(([^)]+)\)$/;
      return 'https://external-content.duckduckgo.com/iu/?u=' + re.exec(this.cardData[key])[1];
    },
    imgFromDesc(desc) {
      return desc.substring(
        desc.indexOf('(') + 1,
        desc.lastIndexOf(')')
      );
    }
  },
  computed: {
    sequence() {
      if (!this.cardData) return [];
      var seq = [];
      for (var key in this.cardData) {
        if (this.cardData[key]) seq.push(key)
      }
      return seq;
    },
    front() {
      if (this.frontKey && this.cardData[this.frontKey]) {
        return this.cardData[this.frontKey];
      } else {
        return '';
      }
    },
    back() {
      if (this.backKey && this.cardData[this.backKey]) {
        return this.cardData[this.backKey];
      } else {
        return '';
      }
    },
    cardData() {
      if (this.cards.length)
        return this.cards[this.cardSelect];
      else
        return null;
    },
  },
  mounted() {
    this.setId = this.$route.params.id;
    this.loadCards();
  },
}
</script>

<style lang="scss" scoped>
#studypage {
  display: flex;
  justify-content: center;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
}
.cardviewer-container {
  width: 100%;
  max-width: 800px;
  padding: 15px 10px 10px 10px;
}
.cardviewer {
  height: 100%;
  max-height: 500px;
  background-color: $light;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.4);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .head {
    display: flex;
    .title {
      min-width: 0;
      flex: 1;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 1.2em;
      padding: 0 10px;
      .text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
          color: $base-color;
          cursor: pointer;
        }
      }
    }
    .selector {
    }
  }
  .selector {
    height: 50px;
    display: flex;
    .option {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5em;
      background-size: 100% 200%;
      background-image: linear-gradient(to bottom, transparent 50%, white 50%);
      transition: background-position 0.2s ease;
      color: $base-color;
      cursor: pointer;
      &.kanji {}
      &.kana {
        padding-bottom: 1px;
      }
      &.description { 
        font-size: 1.6em;
      }
      &.active {
        background-position: 0 -100%;
      }
      &:hover:not(.active) {
        color: $highlight-color;
      }
    }
  }
  .card-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .dummyText {
      position: absolute;
      z-index: 99;
      color: transparent;
      p {
        line-break: strict;
        word-wrap: strict;
        overflow-wrap: anywhere;
        margin: 20px;
        padding: 0;
        &.kanji {
          font-size: 3.9em;
        }
        &.kana {
          font-size: 2.5em;
        }
        &.description {
          font-size: 2em;
        }
      }
    }
    .half {
      position: absolute;
      width: 50%;
      height: 100%;
      &.left {
        left: 0;
      }
      &.right {
        right: 0;
      }
    }
    .card {
      background-color: transparent;
      perspective: 1800px;
      @media only screen and (min-width: $mobile-width) {
        & {
          perspective: 3000px;
        }
      }
      width: 100%;
      height: 100%;
      .content {
        background-color: white;
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        .side {
          overflow: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          .img-container {
            width: 100%;
            height: 100%;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          }
          p {
            line-break: strict;
            word-wrap: strict;
            overflow-wrap: anywhere;
            margin: 20px;
            padding: 0;
            &.kanji {
              font-size: 3.9em;
            }
            &.kana {
              font-size: 2.5em;
            }
            &.description {
              font-size: 2em;
            }
          }
        }
        .back {
          transform: rotateY(180deg);
        }
      }
    }
  }
  .navigator {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &.left, &.right {
        cursor: pointer;
        flex-grow: 1;
        transition: background-color 0.1s ease;
        @media only screen and (min-width: $mobile-width) {
          &:hover {
            background-color: $base-color;
          }
          &:active {
            background-color: $highlight-color;
          }
        }
      }
      &.mid {
        flex-basis: 86px;
        flex-grow: 0;
        border-left: 1px solid #A9A9A9;
        border-right: 1px solid #A9A9A9;
        padding: 0 10px;
      }
    }
  }
}
</style>