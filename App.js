import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Linking,
  Alert,
  Text
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import * as DocumentPicker from 'expo-document-picker';
import * as mime from 'react-native-mime-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import Firebase from './lib/firebase';

export default function App() {

    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState("");

    useEffect(() => {
      this.listener = EventRegister.addEventListener('onProgress', (data) => {
          setProgress(data);
      });
    });

    useEffect(() => {
      return () => {
        EventRegister.removeEventListener(this.listener);
      }
    }, []);

  _onPressDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    console.log('Result:', result);
    if (result.type != "cancel" && !result.cancelled) {
      this.addToFirebase(result.uri, result.name)
    }
  }

  _onPressLibrary = async () => {
    await this.pickContent((result) => {
      console.log('Result:', result);
      if (result.type != "cancel" && !result.cancelled) {
        this.addToFirebase(result.uri, result.name);
      }
    });
  }

  _onPressCamera = async () => {
    await this.takePicture((result) =>{
      console.log('Result:', result);
      if (result.type != "cancel" && !result.cancelled) {
        this.addToFirebase(result.uri, result.name);
      }
    });
  }

  addToFirebase = (uri, name) => {
    setUrl('');
    var extension = uri.split('.').pop();
    var contentType = mime.lookup(extension);
    let firebase = Firebase.getInstance();
    if(!name) { name = '' }
    firebase.saveStorage('new/', uri, name, contentType, extension)
      .then((res) => {
          console.log(res);
          setUrl(res.url);
      })
      .catch((error) => {
          console.log(error);
      });
  }

  pickContent = async (callback) => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
          callback({cancelled: true});
          this.openParameter('Enable photos', 'Grant access to access to your library');
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: 'All'
        });
        callback(result);
      }
  };

  takePicture = async (callback) => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
          callback({cancelled: true});
          this.openParameter('Enable photos', 'Grant access to access to your library');
      } else {
          let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              mediaTypes: 'All'
          });
          callback(result);
      }
  };

  openParameter = (title, content) => {
    Alert.alert(
      title,
      content,
      [
        {text: 'Open parameter', onPress: () => Linking.openURL('app-settings:')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: false }
    )
  }

  return (
    <View style={styles.container}>
      <Button
          color="#333"
          title="Upload content from your drive"
          onPress={this._onPressDocumentPicker}
          style={styles.button}
        />
      <Button
          color="#333"
          title="Upload content from your library"
          onPress={this._onPressLibrary}
          style={styles.button}
        />
      <Button
          color="#333"
          title="Upload content from your camera"
          onPress={this._onPressCamera}
          style={styles.button}
        />
        {
          progress != 0 ?
          <Progress.Circle progress={progress} size={75} showsText={true} />
          : null
        }
        {
          url != '' ?
          <Text style={styles.text}>File URL: {url}</Text>
          : null
        }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 10,
    color: '#fff',
    marginBottom: 20
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
    marginHorizontal: 10
  }
});
