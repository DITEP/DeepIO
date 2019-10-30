import axios from 'axios';

const BASE_URI = 'http://vls-diteplearn:8001';

const client = axios.create({
 baseURL: BASE_URI,
 json: true
});

class APIClient {
  /*** ///  Maps to auth controller  ///***/  
  login(user) {
    return this.perform('post', '/login', user);
  }
 
  getAuth() {
    return this.perform('get', '/hasAuth');
  }
   
  logout() {
    this.perform('delete', '/logoutAccessToken').then(() => {
      console.log('done');
    })
  }
  
  refresh() {
    return this.performRefresh('post', '/refresh');
  }

  /*** ///  Maps to user controller  ///***/
  createUser(newUser) {
    return this.perform('post', '/user', newUser);
  }
 
  getUser(user) {
   return this.perform('get', '/user', user);
  }
  
  updateUserHistory(predictionID) {
    return this.perform('put', '/updateUserHistory', predictionID);
  }
  
  changeEmail(email) {
    return this.perform('put', '/changeEmail', email);  
  }
  
  checkPassword(oldPassword) {
    return this.perform('post', '/checkPassword', oldPassword);  
  }
  
  changePassword(newPassword) {
    return this.perform('put', '/changePassword', newPassword);
  }

  getUserDetails(email) {
    return this.perform('get', '/user?email=' + email);
  }

  /*** ///  Maps to prediction controller  ///***/
  createPrediction(prediction) {
    return this.perform('post', '/prediction', prediction);
  }

  /*** ///  Maps to prediction controller  ///***/
  createQueueItem(newQueueItem) {
    return this.perform('post', '/queue', newQueueItem);
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