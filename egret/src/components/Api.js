import axios from 'axios'

const request = axios.create({
  baseURL: 'https://egret-kishawi-carter.herokuapp.com'
})

export function getToken (username, password) {
  return request.post('/api/auth/token/login/', {
    username: username,
    password: password
  }).then(response => response.data.auth_token)
}

export function getCards (token) {
  return request.get('api/cards', {
    headers: {
      Authorization: `Token ${token}` // this is how we comm w backend
    }
  })
}

