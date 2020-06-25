import axios from 'axios';
import authHeader from './auth-header';
import vars from '../vars';
import { EventBus } from '../event-bus';

const API_URL = process.env.NODE_ENV === 'production' ? '/api/graphql/' : 'http://192.168.2.6:5000/api/graphql/';

class SetService {
    resolveError(code) {
        if (code == vars.errors.tokenExpired.code) {
            EventBus.$emit('refreshLogin');
        }
        for (var err in vars.errors) {
            if (vars.errors[err].code == code) {
                return vars.errors[err];
            }
        }
        return vars.errors.genericError;
    }

    resolveErrors(errors) {
        var resolvedErrors = [];
        errors.forEach((error) => {
            resolvedErrors.push(this.resolveError(error.code));
        });
        return resolvedErrors;
    }

    getSetById(id) {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        {
                            set(id: "${id}") {
                                name
                                description
                                public
                                owner {
                                    username
                                }
                                cards {
                                    kanji
                                    kana
                                    description
                                }
                            }
                        }
                    `
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.set)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }

    getAllUserSets() {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        {
                            allUserSets {
                                name
                                description
                                numCards
                                public
                                id
                                cards {
                                    kanji
                                    kana
                                    description
                                }
                            }
                        }
                    `
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.allUserSets)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }

    getEndorsedSets() {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        {
                            endorsedSets {
                                name
                                description
                                numCards
                                id
                            }
                        }
                    `
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.endorsedSets)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }

    getSetsBySearch(search, page, perPage) {
        if (!perPage) perPage = null;
        if (!page) page = null;
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        {
                            sets(search: "${search}", page: ${page}, perPage: ${perPage}) {
                                name
                                description
                                numCards
                                id
                            }
                        }
                    `
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.sets)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }

    addSet(set) {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        mutation ($set: SetInput!) {
                            addSet(set: $set) {
                                name
                                description
                                id
                                numCards
                                cards {
                                    kanji
                                    kana
                                    description
                                }
                            }
                        }
                    `,
                    variables: {
                        set
                    }
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.addSet)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }

    removeSet(id) {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        mutation ($id: String!) {
                            removeSet(setId: $id) {
                                name
                            }
                        }
                    `,
                    variables: {
                        id
                    }
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.removeSet)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }

    updateSet(id, update) {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        mutation ($id: String!, $update: SetUpdateInput!) {
                            updateSet(setId: $id, update: $update) {
                                name
                                description
                                numCards
                                cards {
                                    kanji
                                    kana
                                    description
                                }
                            }
                        }
                    `,
                    variables: {
                        id,
                        update
                    }
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.updateSet)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }

    addCard(id, card) {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        mutation ($id: String!, $card: CardInput!) {
                            addCard(setId: $id, card: $card) {
                                name
                                description
                                numCards
                                cards {
                                    kanji
                                    kana
                                    description
                                }
                            }
                        }
                    `,
                    variables: {
                        id,
                        card
                    }
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.addCard)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }

    removeCard(setId, cardId) {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: API_URL,
                headers: authHeader(),
                data: {
                    query: `
                        mutation ($setId: String!, $cardId: String!) {
                            removeCard(setId: $setId, cardId: $cardId) {
                                kanji
                                kana
                                description
                            }
                        }
                    `,
                    variables: {
                        setId,
                        cardId
                    }
                }
            }).then((res) => {
                if (res.data.errors) {
                    reject(this.resolveErrors(res.data.errors));
                } else {
                    resolve(res.data.data.removeCard)
                }
            }).catch(() => {
                reject([vars.errors.clientError])
            });
        });
    }
}

export default new SetService();