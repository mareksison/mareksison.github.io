import axios from 'axios';

// current hosting url
const host = 'http://localhost:3001';

/**
 * @endpoint
 * @body
 * @headers - object of headers
 * @successCallback to execute after the call is successfully done
 * @errorCallback to execute after the call is successfully done
 * 
 * reponse looks like this:
 * @data
 * @status
 * @statusText
 * @headers
 * @config
 */
const Service = {
  post: async (endpoint:any, body:any, headers:any, successCallback:any, errorCallback:any) => {
    try {
      return await axios.post(host+endpoint, body, { headers:headers })
      .then(function (response){
        console.log('SUCCESSFUL POST');
        successCallback(response);
      }, function (err) {
        console.log(err);
        errorCallback(err);
      });
    }
    catch(err) {
      console.error(err);
      errorCallback(err);
    }
  },
  get: async (endpoint:any, headers:any, successCallback:any, errorCallback:any) => {
    try {
      return await axios.get(host+endpoint, { headers:headers })
      .then(function (response) {
        successCallback(response);
      });
    }
    catch(err) {
      console.error(err);
      errorCallback(err);
    }
  },
  patch: async (endpoint:any, body:any, headers:any, successCallback:any, errorCallback:any) => {
    try {
      return await axios.patch(host+endpoint, body, { headers:headers })
      .then(function (response){
        successCallback(response);
      });
    }
    catch(err) {
      console.error(err);
      errorCallback(err);
    }
  },
  delete: async (endpoint:any, headers:any, successCallback:any, errorCallback:any) => {
    try {
      return await axios.delete(host+endpoint, { headers:headers })
      .then(function (response){
        successCallback(response);
      });
    }
    catch(err) {
      console.error(err);
      errorCallback(err);
    }
  }
};

export default Service;