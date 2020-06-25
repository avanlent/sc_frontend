import axios from 'axios';
import AuthHeader from './auth-header'
var SHA256 = require("crypto-js/sha256");

const API_URL = process.env.NODE_ENV === 'production' ? '/api/auth/' : 'http://192.168.2.6:5000/api/auth/';


class AuthService {
  login(user) {
    return new Promise((resolve, reject) => {
        axios.post(API_URL + 'signin', {
            username: user.username,
            password: user.password && SHA256(user.password).toString()
        }).then((res) => {
            if (res.data.accessToken) {
                localStorage.setItem('token', JSON.stringify(res.data.accessToken));
                localStorage.setItem('username', res.data.username);
                resolve({ message: res.data.message, username: res.data.username });
            } else {
                reject(res.data.message);
            }
        }).catch((err) => {
            reject(err);
        })
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  signup(user) {
    return new Promise((resolve, reject) => {
        axios.post(API_URL + 'signup', {
            username: user.username,
            email: user.email,
            password: user.password && SHA256(user.password).toString()
        }).then((res) => {
            if (res.data.accessToken) {
                localStorage.setItem('token', JSON.stringify(res.data.accessToken));
                resolve({ message: res.data.message, username: res.data.username });
            } else {
                reject(res.data.message);
            }
        }).catch((err) => {
            reject(err);
        })
    });
  }

  check() {
    return new Promise((resolve, reject) => {
        const token = JSON.parse(localStorage.getItem('token'));
        const username = localStorage.getItem('username');
        if (!token || !username) {
          reject();
        } else {
          axios.get(API_URL + 'check', { headers: AuthHeader() }).then((res) => {
            localStorage.setItem('token', JSON.stringify(res.data.accessToken));
            resolve();
          }).catch(() => {
            reject();
          });
        }
    });
  }
}

export default new AuthService();