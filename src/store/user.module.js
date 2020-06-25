import AuthService from '../services/auth.service';

const token = JSON.parse(localStorage.getItem('token'));
const username = localStorage.getItem('username');
const initialState = { loadingStatus: 'notLoading', appReady: false };
if (token && username) {
    initialState.loginStatus = 'loggedIn';
    initialState.username = username;
} else {
    initialState.loginStatus = 'notLoggedIn';
    initialState.username = 'no username';
}

export const userModule = {
    namespaced: true,
    // -- These are the states, initialState used to populate on load
    // loginStatus,
    // loadingStatus,
    // username
    state: initialState,
    mutations: {
        SET_LOADING_STATUS(state, status) {
            state.loadingStatus = status;
        },
        SET_USERNAME(state, username) {
            state.username = username;
        },
        SET_LOGIN_STATUS(state, status) {
            state.loginStatus = status;
        },
        SET_APPREADY_STATUS(state, status) {
            state.appReady = status;
        },
    },
    getters: {
        isLoading: state => {
            return state.loadingStatus == 'loading';
        },
        isLoggedIn: state => {
            return state.loginStatus == 'loggedIn';
        }
    },
    actions: {
        login({ commit }, user) {
            commit('SET_LOADING_STATUS', 'loading');
            return new Promise((resolve, reject) => {
                AuthService.login(user).then((data) => {
                    commit('SET_USERNAME', data.username);
                    commit('SET_LOGIN_STATUS', 'loggedIn');
                    resolve(data.message);
                }).catch((err) => {
                    commit('SET_LOGIN_STATUS', 'notLoggedIn');
                    reject(err);
                }).finally(() => {
                    commit('SET_LOADING_STATUS', 'notLoading');
                })
            });
        },
        signup({ commit }, user) {
            commit('SET_LOADING_STATUS', 'loading');
            return new Promise((resolve, reject) => {
                AuthService.signup(user).then((data) => {
                    commit('SET_USERNAME', data.username);
                    commit('SET_LOGIN_STATUS', 'loggedIn');
                    resolve(data.message);
                }).catch((err) => {
                    commit('SET_LOGIN_STATUS', 'notLoggedIn');
                    reject(err);
                }).finally(() => {
                    commit('SET_LOADING_STATUS', 'notLoading');
                })
            });
        },
        logout({ commit }) {
            commit('SET_LOADING_STATUS', 'loading');
            AuthService.logout();
            commit('SET_USERNAME', 'no username');
            commit('SET_LOGIN_STATUS', 'notLoggedIn');
            commit('SET_LOADING_STATUS', 'notLoading');
        },
        check({ commit, dispatch }) {
            commit('SET_LOADING_STATUS', 'loading');
            AuthService.check().then(() => {
                commit('SET_USERNAME', localStorage.getItem('username'));
                commit('SET_LOGIN_STATUS', 'loggedIn');
            }).catch(() => {
                dispatch('logout');
            }).finally(() => {
                commit('SET_APPREADY_STATUS', true);
                commit('SET_LOADING_STATUS', 'notLoading');
            })
        }
    }
}