import { ACCESS_TOKEN, API_BASE_URL } from '../constants/index'

const axios = require('axios');


export function signup(signupRequest) {
    
    return axios({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        url: API_BASE_URL + "/auth/register",
        data: {
            'name': signupRequest.name,
            'phone': signupRequest.phone,
            'email': signupRequest.email,
            'password': signupRequest.password
        }
    });

}

export function login(loginRequest) {

    return axios({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        url: API_BASE_URL + "/auth/login",
        data: {
            'email': loginRequest.email,
            'password': loginRequest.password
        }
    });

}

export function getCurrentUser() {

    return axios({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
        },
        url: API_BASE_URL + "/user/me",

    });
}
export function loadUserChats() {

    return axios({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
        },
        url: API_BASE_URL + "/user/chat",

    });
}

export function loadChatMessages() {

    return axios({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
        },
        url: API_BASE_URL + "/user/chat",

    });
}

