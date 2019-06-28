import { ACCESS_TOKEN, API_BASE_URL } from '../constants/index'

const axios = require('axios');


export function login(loginRequest) {

    return axios({
        method: 'POST',
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
        ,'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json' },
        url: API_BASE_URL + "/auth/login",
        data: {
            email: loginRequest.email,
            password: loginRequest.password
        }
      }).then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );;


    //   axios.post(API_BASE_URL + "/auth/login", {
    //         email: loginRequest.email,
    //         password: loginRequest.password
    //   })
    //   .then(response => 
    //     response.json().then(json => {
    //         console.log(json);
    //         if(!response.ok) {
    //             return Promise.reject(json);
    //         }
    //         return json;
    //     })
    // );
}

export function getUserChats() {
    axios({
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
        'Authorization':'Bearer ' + localStorage.getItem(ACCESS_TOKEN) },
        url: API_BASE_URL + "/user/chat",
        
      }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log('data:', data.html_url);
    });
}

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


// export function getCurrentUser() {
//     if(!localStorage.getItem(ACCESS_TOKEN)) {
//         return Promise.reject("No access token set.");
//     }

// }