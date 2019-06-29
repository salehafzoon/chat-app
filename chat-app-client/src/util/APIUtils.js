import { ACCESS_TOKEN, API_BASE_URL } from '../constants/index'

const axios = require('axios');


export function signup(signupRequest) {
    // return request({
    //     url: API_BASE_URL + "/auth/register",
    //     method: 'POST',
    //     body: JSON.stringify(signupRequest)
    // });

    fetch(API_BASE_URL + "/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
            name: "hesam",
            phone: "0927",
            email: "test7@email.com",
            password: "secret"

        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log('data:', data.html_url);
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

