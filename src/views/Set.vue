<template>
    <div id="setpage">
        <a-spin v-if="loading">
            <a-icon slot="indicator" type="loading" style="font-size: 50px; marginTop: 20px" spin />
        </a-spin>
        <div v-else-if="!loading && !hasError" class="content">
            <div class="details">
                <eva-icon v-if="isOwner" name="edit" fill="#4a4a4a" width="21" height="21" class="mod" @click="$router.push('/edit/' + setId)"></eva-icon>
                <div class="text">
                    <div class="name">{{ set.name }}</div>
                    <div v-if="set.description" class="desc">{{ set.description }}</div>
                    <div v-else class="desc" :style="{color: '#b3b3b3'}">No description</div>
                </div>
                <div class="study">
                    <a-button type="primary" block @click="$router.push('/study/' + setId)" ><a-icon type="caret-right" />Study</a-button>
                </div>
            </div>
            <div v-if="set.cards.length > 0" class="cards">
                <div class="card" v-for="(card, i) in set.cards" :key="i">
                    <div class="data kanji"><span>{{ card.kanji }}</span></div>
                    <div class="data kana"><span>{{ card.kana }}</span></div>
                    <!-- <div class="data desc"><span>{{ card.description }}</span></div> -->
                    <div class="data desc" v-html="description(card.description)"></div>
                </div>
            </div>
            <div v-else class="cards">Looks like this set has no cards.</div>
        </div>
    </div>
</template>

<script>
import SetService from '../services/set.service'

export default {
    name: 'Set',
    data() {
        return {
            setId: '',
            set: '',
            loading: true,
            hasError: false,
        }
    },
    methods: {
        fetchSet() {
            SetService.getSetById(this.setId).then((set) => {
                this.set = set;
            }).catch((errs) => {
                this.hasError = true;
                switch (errs[0].code) {
                    case 302: case 206: this.$router.replace('/404'); break;
                    case 106: case 108: this.$router.replace('/unauthorized'); break;
                    default: this.$message.error('An error has occured'); this.$router.go(-1); break;
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        isImgDesc(desc) {
            // var re = /^\[img\]\(.*\.(jpg|JPG|png|PNG|gif|GIF)\)$/;
            var re = /^\[img\]\(.*\)$/;
            return re.test(desc);
        },
        description(desc) {
            if (!desc) return '';
            if (this.isImgDesc(desc))
                return `<span style="font-style: italic">[image]</span>`
            else
                return `<span>${desc}</span>`
        }
    },
    computed: {
        isOwner() {
            return this.set && (this.set.owner.username == this.$store.state.user.username)
        },
    },
    mounted() {
        this.setId = this.$route.params.id;
        this.fetchSet();
    },
}
</script>

<style lang="scss" scoped>
#setpage {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    padding: 0 10px;
}
.content {
    width: 100%;
    max-width: 900px;
    .details {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.4);
        border-radius: 4px;
        padding: 10px;
        position: relative;
        .mod {
            position: absolute;
            top: 5px;
            right: 7px;
            cursor: pointer;
            height: 28px;
            width: 28px;
            border-radius: 4px;
            background-color: rgba(0,0,0,0.22);
            margin-left: 4px;
            padding: 2px 0 0 0;
        }
        .text {
            .name {
                font-size: 2em;
                padding: 5px;
            }
            .desc {
                font-size: 1.2em;
                padding: 0 50px;
            }
        }
        .study {
            max-width: 200px;
            margin: auto;
            margin-top: 20px;
        }
    }
    .cards {
        margin-top: 10px;
        padding: 10px 2px;
        .card {
            margin: 5px 0;
            font-size: 1.1em;
            padding: 5px;
            width: 100%;
            border: 1px solid #d9d9d9;
            display: flex;
            flex-direction: column;
            .data {
                span {
                    line-break: strict;
                    word-break: keep-all;
                    overflow-wrap: anywhere;
                }
                &.desc span {
                    line-break: anywhere;
                }
            }
            .kanji, .kana {
                font-size: 1.2em;
            }
            .data:not(:empty) {
                padding: 5px;
            }
            /* Desktop */
            @media only screen and (min-width: $mobile-width) {
                display: grid;
                grid-template-columns: repeat(2, 24%) 1fr;
                gap: 10px;
                .data {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
}
</style>