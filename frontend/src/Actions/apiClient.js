import axios from 'axios';

const BASE_URI = 'http://vls-diteplearn:8000';

const client = axios.create({
 baseURL: BASE_URI,
 json: true
});

class APIClient {  
  createUser(newUser) { console.log(newUser);
    return this.perform('post', '/user', newUser);
  }
 
  getUser(user) { console.log(user);
   return this.perform('get', '/user', user);
  }

  login(user) { console.log(user);
    return this.perform('post', '/login', user);
  }
 
  getHello() {
    return this.perform('get', '/hello');
  }

  async perform (method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }      
    }).then(resp => {
      return resp.data ? resp.data : [];
    })
   }
}

export default APIClient;