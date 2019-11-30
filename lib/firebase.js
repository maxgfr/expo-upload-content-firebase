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

import { EventRegister } from 'react-native-event-listeners';

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

  saveStorage(place, uri, name, contentType, extension) {
    return new Promise((resolve, reject) => {
      try {
        this.urlToBlob(uri)
        .then((res) => {
          console.log(res)
          if(name == '') {
            name = uuid.v4()+"."+extension;
          }
          var uploadTask = firebase.storage().ref().child(place+name).put(res, { contentType: contentType});

          uploadTask.on('state_changed', function(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes);
            EventRegister.emit('onProgress', progress);
            console.log('Upload is ' + progress);
             switch (snapshot.state) {
               case firebase.storage.TaskState.PAUSED: // or 'paused'
               console.log('Upload is paused');
               break;
               case firebase.storage.TaskState.RUNNING: // or 'running'
               console.log('Upload is running');
               break;
             }
          }, function(error) {
            console.log(error)
            reject(error);
          }, function() {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                resolve({url: downloadURL, name: name});
              })
              .catch((error) => {
                console.log(error)
                reject(error);
              });
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
