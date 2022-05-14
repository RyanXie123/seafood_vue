import axios from 'axios'

const debugBase = "http://127.0.0.1:8000";
const productBase = "https://apidjackets.seafood.fit";
const instance = axios.create({
    baseURL: debugBase + '/api/v1',
    timeout: 10000
})

export const get = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        instance.get(url, { params }).then((response) => {
            console.log(response);
            resolve(response.data)
        }, err => {
            reject(err)
        })
    })
}

export const post = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            resolve(response.data)
        }, err => {
            reject(err)
        })
    })
}
