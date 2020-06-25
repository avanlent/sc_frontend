<template>
    <div id="setpage">
        <a-spin v-if="loading">
            <a-icon slot="indicator" type="loading" style="font-size: 50px; marginTop: 20px" spin />
        </a-spin>
        <div v-else-if="!loading && !hasError" class="content-container">
            <card-modal v-model="showCardModal" :card="modalCardSupply" />

            <div class="options">
                <a-popconfirm
                    title="Confirm delete set."
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteSet()"
                    placement="bottomLeft"
                >
                    <a-button type="danger" class="delete" block :disabled="submitting">Delete set</a-button>
                </a-popconfirm>
                <a-popconfirm
                    title="Confirm submit changes."
                    ok-text="Yes"
                    cancel-text="No"
                    placement="bottomRight"
                    @confirm="submitChanges()"
                >
                    <a-button type="primary" class="submit" block :loading="submitting">Submit changes</a-button>
                </a-popconfirm>
            </div>
            <div class="content">
                <div class="details">
                    <div class="text">
                        <a-form-model :label-col="{ md: 3 }" :wrapper-col="{ md: 21 }">
                            <a-form-model-item label="Name" :validateStatus="nameStatus">
                                <a-input v-model="set.name" placeholder="name required" :disabled="submitting"  />
                            </a-form-model-item>
                            <a-form-model-item label="Description">
                                <a-textarea v-model="set.description" placeholder="no description" :disabled="submitting" />
                            </a-form-model-item>
                            <a-form-model-item label="Public" :wrapper-col="{ xs: 1, sm: 24, md: 1 }">
                                <a-switch v-model="set.public" :disabled="submitting" >
                                    <a-icon slot="checkedChildren" type="check" />
                                    <a-icon slot="unCheckedChildren" type="close" />
                                </a-switch>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div class="newcard">
                        <a-button type="default" @click="newCard()" :disabled="submitting" ><a-icon type="plus" />Add Card</a-button>
                    </div>
                    <div class="mark">
                        Mark for delete
                    </div>
                </div>
                <div v-if="set.cards.length > 0" class="cards">
                    <transition-group name="card-list" tag="div">
                        <div class="card-container" v-for="(card, idx) in set.cards" :key="card.id">
                            <div class="box">
                                <a-checkbox :disabled="submitting" @change="markForDelete($event, idx)" />
                            </div>
                            <div class="position">
                                <a-icon type="up-square" class="item up" @click="moveUp(idx)" />
                                <a-icon type="down-square" class="item down" @click="moveDown(idx)" />
                            </div>
                            <div class="card">
                                <eva-icon name="edit" fill="#4a4a4a" width="19" height="19" class="edit" @click="editCard(card)"></eva-icon>
                                <div class="info" v-if="card.new || card.updated">{{ card.new ? card.updated ? 'new update' : 'new' : 'update' }}</div>
                                <div class="data kanji"><span>{{ card.kanji }}</span></div>
                                <div class="data kana"><span>{{ card.kana }}</span></div>
                                <div class="data desc"><span>{{ card.description }}</span></div>
                            </div>
                        </div>
                    </transition-group>
                </div>
                <div v-else class="cards">Looks like this set has no cards.</div>
            </div>
        </div>
    </div>
</template>

<script>
import CardModal from '../components/modals/CardModal';
import SetService from '../services/set.service';
import { EventBus } from '../event-bus';

export default {
    name: 'Edit',
    components: {
        CardModal
    },
    data() {
        return {
            setId: '',
            set: '',
            loading: true,
            submitting: false,
            showCardModal: false,
            nameStatus: null,
            hasError: false,
            modalCardSupply: null,
            nextId: 0,
        }
    },
    methods: {
        newCard() {
            this.modalCardSupply = null;
            this.showCardModal = true;
        },
        editCard(card) {
            this.modalCardSupply = card;
            this.showCardModal = true;
        },
        closeModal() {
            this.showCardModal = false;
        },
        markForDelete(e, i) {
            this.set.cards[i].delete = e.target.checked;
        },
        moveUp(i) {
            if (i == 0) return;
            var newArr = [];
            for (var k = 0; k < i-1; k++) {
                newArr.push(this.set.cards[k])
            }
            newArr.push(this.set.cards[i]);
            newArr.push(this.set.cards[i-1]);
            for (k = i + 1; k < this.set.cards.length; k++) {
                newArr.push(this.set.cards[k]);
            }
            this.set.cards = newArr;
        },
        moveDown(i) {
            if (i == this.set.cards.length-1) return;
            var newArr = [];
            for (var k = 0; k < i; k++) {
                newArr.push(this.set.cards[k])
            }
            newArr.push(this.set.cards[i+1]);
            newArr.push(this.set.cards[i]);
            for (k = i + 2; k < this.set.cards.length; k++) {
                newArr.push(this.set.cards[k]);
            }
            this.set.cards = newArr;
        },
        deleteSet() {
            SetService.removeSet(this.setId).then(() => {
                this.$message.success('Set deleted succcessfully', 1);
                this.$router.replace('/user');
            }).catch(() => {
                this.$message.warn('Set not removed');
            });
        },
        submitChanges() {
            if (this.submitting) return;
            this.submitting = true;

            this.nameStatus = null;
            if (!this.set.name) {
                this.$message.error('Set name required!')
                this.nameStatus = 'error'
                this.submitting = false;
                return;
            }

            var updatedSet = {}
            updatedSet.name = this.set.name;
            updatedSet.description = this.set.description;
            updatedSet.public = this.set.public;
            updatedSet.cards = this.set.cards.filter((card) => {
                return !card.delete;
            }).map((card) => {
                var reducedCard = {}
                if (card.kanji) reducedCard.kanji = card.kanji;
                if (card.kana) reducedCard.kana = card.kana;
                if (card.description) reducedCard.description = card.description;
                return reducedCard;
            });

            SetService.updateSet(this.setId, updatedSet).then(() => {
                this.$message.success('Set updated successfully!');
                this.$router.push('/set/' + this.setId);
            }).catch(() => {
                this.$message.error('Unable to update set!')
            }).finally(() => {
                this.submitting = false;
            });
        },
        resolveSuccess(card) {
            console.log('resolve')
            if ('id' in card) {
                this.updateCard(card);
            } else {
                this.addCard(card);
            }
        },
        addCard(card) {
            this.nextId += 1;
            card.id = this.nextId - 1;
            card.new = true;
            this.set.cards.unshift(card);
            this.closeModal();
        },
        updateCard(updatedCard) {
            var updateIdx = this.set.cards.findIndex(card => card.id == updatedCard.id);
            this.set.cards[updateIdx].updated = true;
            if (updatedCard.kanji) this.set.cards[updateIdx].kanji = updatedCard.kanji;
            if (updatedCard.kana) this.set.cards[updateIdx].kana = updatedCard.kana;
            if (updatedCard.description) this.set.cards[updateIdx].description = updatedCard.description;
            this.closeModal();
        },
        fetchSet() {
            SetService.getSetById(this.setId).then((set) => {
                this.set = set;
                if (!this.isOwner) {
                    this.$router.replace('/unauthorized');
                }
                for (var i = 0; i < this.set.cards.length; i++) {
                    this.set.cards[i].id = this.nextId;
                    this.nextId +=1 ;
                }
            }).catch((errs) => {
                this.hasError = true;
                switch (errs[0].code) {
                    case 302: case 206: this.$router.replace('/404'); break;
                    case 106: case 108: this.$router.replace('/unauthorized'); break;
                    default: this.$message.error('An error has occured'); this.$router.go(-1); break;
                }
            }).finally(() => {
                this.loading = false;
            });
        }
    },
    computed: {
        isOwner() {
            return this.set && (this.set.owner.username == this.$store.state.user.username);
        }
    },
    mounted() {
        this.setId = this.$route.params.id;
        this.fetchSet();
        EventBus.$on('card-modal-success', (card) =>{
            this.resolveSuccess(card)
        });
        EventBus.$on('card-modal-closeClick', () =>{
            this.closeModal()
        });
    },
    beforeDestroy() {
        EventBus.$off('card-modal-success');
        EventBus.$off('card-modal-closeClick');
    },
    
}
</script>

<style lang="scss" scoped>
#setpage {
    display: flex;
    justify-content: center;
    padding: 0 10px;
}


.card-list-move {
    transition: transform 0.2s ease-in-out;
}

.content-container {
    width: 100%;
    max-width: 900px;
    margin: 10px 0;
    .options {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 10px;
        .delete, .submit {
            flex-basis: 0;
            flex-grow: 1;
            min-width: 150px;
            max-width: 25%;
        }
    }
}
.content {
    width: 100%;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.4);
    border-radius: 4px;
    padding: 10px;
    .details {
        position: relative;
        .mark {
            position: absolute;
            float: right;
            bottom: 0;
            right: 0;
            max-width: 100px;
            text-align: end;
        }
    }
    .cards {
        .card-container {
            display: flex;
            position: relative;
            .card {
                .edit {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    cursor: pointer;
                }
            }
        }
        .box {
            display: flex;
            align-items: center;
            padding: 0 5px;
            order: 2;
        }
        .position {
            margin: 5px 0;
            padding-right: 5px;
            order: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 30px;
            .item {
                margin: 1px 0;
                @media only screen and (min-width: $mobile-width) {
                    font-size: 18px;
                    cursor: pointer;
                    &:hover{
                        transform: scale(1.1);
                    }
                }
            }
        }
        .card {
            margin: 5px 0;
            font-size: 1.1em;
            padding: 5px;
            width: 100%;
            border: 1px solid #d9d9d9;
            position: relative;
            .info {
                position: absolute;
                line-height: 100%;
                top: 0;
                left: 2px;
                color: $base-color;
                font-size: 0.8em;
                text-decoration: underline;
            }
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