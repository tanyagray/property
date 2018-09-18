import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const consumerKey = functions.config().trademe.key;
const consumerSecret = functions.config().trademe.secret;

const generateNonce = () => {
  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
}

const urlEncode = (params) => {

  let encoded = 'OAuth ';
  let key;

  for (key in params) {
    const value = encodeURIComponent(params[key]);
    encoded += `${key}=${value}, `;
  }

  return encoded;
}

export const acquireTemporaryToken = functions.https.onRequest((request, response) => {

  const url = `${functions.config().trademe.api}/Oauth/RequestToken`;

  const params = {
    oauth_consumer_key: consumerKey,
    oauth_version: '1.0',
    oauth_timestamp: Date.now(),
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'PLAINTEXT',
    oauth_signature: `${consumerSecret}&`
  };

  const headers = {
    'Content-Type': 'text/plain',
    'Authorization': urlEncode(params)
  };

  const authRequest = {
    method: 'POST',
    headers: headers
  };

  fetch( url, authRequest )
    .then( res => res.text() )
    .then( text => response.send( text ) )
    .catch( err => response.send( err ) );
  
});