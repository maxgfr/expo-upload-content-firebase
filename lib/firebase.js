import uuid from 'uuid';
import * as firebase from 'firebase';

import {
  FIREBASE_PROJECT_ID,
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  STORAGE_BUCKET
} from 'react-native-dotenv'

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  storageBucket: STORAGE_BUCKET,
  projectId: FIREBASE_PROJECT_ID
};

export default class Firebase {

  static myInstance = null;

  static getInstance() {
    if (Firebase.myInstance == null) {
      Firebase.myInstance = new Firebase();
    }
    return this.myInstance;
  }

  constructor(){
    try {
      firebase.initializeApp(firebaseConfig);
    } catch(e) {
      console.log(e);
    }
  }

  storeItem(place, uri, name, contentType) {
    return new Promise((resolve, reject) => {
      try {
        this.urlToBlob(uri)
        .then((res) => {
          console.log(res)
          if(name == '') {
            name = uuid.v4();
          }
          firebase.storage().ref().child(place+name).put(res, { contentType: contentType})
            .then((snapshot) => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                  console.log('File available at', downloadURL);
                  resolve({url: downloadURL, name: name});
                })
                .catch((error) => {
                  console.log(error)
                  reject(error);
                });
            })
            .catch((error) => {
              console.log(error)
              reject(error);
            });
        })
        .catch((error) => {
          console.log(error)
           reject(error);
        })
      } catch(e) {
        console.log(error)
        reject(error);
      }
    });
  }

  urlToBlob (url) {
    return new Promise((resolve, reject) => {
        try {
          var xhr = new XMLHttpRequest();
          xhr.onerror = reject;
          xhr.onreadystatechange = () => {
              if (xhr.readyState === 4) {
                  resolve(xhr.response);
              }
          };
          xhr.open('GET', url);
          xhr.responseType = 'blob'; // convert type
          xhr.send();
        } catch(e) {
          reject(e)
        }
    })
  }

}
