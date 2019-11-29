import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Linking,
  Alert,
  NetInfo
} from 'react-native';
import Firebase from './lib/firebase';
import * as DocumentPicker from 'expo-document-picker';
import * as mime from 'react-native-mime-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';

export default function App() {

  state = {
    progress: 0
  }

  _onPressDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    console.log('Result:', result);
    if (result.type != "cancel" && !result.cancelled) {
      this.addToFirebase(result.uri, result.name, result.size)
    }
  }

  _onPressCamera = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    console.log('Result:', result);
    if (result.type != "cancel" && !result.cancelled) {
      this.addToFirebase(result.uri, result.name, result.size);
    }
  }

  _onPressLibrary = async () => {
    await this.pickContent((result) => {
      console.log('Result:', result);
      if (result.type != "cancel" && !result.cancelled) {
        this.addToFirebase(result.uri, result.name, result.size);
      }
    });
  }

  _onPressCamera = async () => {
    await this.takePicture((result) =>{
      console.log('Result:', result);
      if (result.type != "cancel" && !result.cancelled) {
        this.addToFirebase(result.uri, result.name, result.size);
      }
    });
  }

  addToFirebase = (uri, name, size) => {
    var extension = uri.split('.').pop();
    var contentType = mime.lookup(extension);
    this.initProgressBar(size);
    let firebase = Firebase.getInstance();
    if(!name) { name = '' }
    firebase.saveStorage('new/', uri, name, contentType, extension)
      .then((res) => {
          console.log(res);
      })
      .catch((error) => {
          console.log(error);
      });
  }

  initProgressBar = (size) => {
    console.log(size);
    NetInfo.getConnectionInfo().then(connectionInfo => {
      console.log(
        'Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType
      );
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
          this.state.progress != 0 ?
          <Progress.Circle progress={this.state.progress} size={75} showsText={true} />
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
    color: '#fff'
  }
});
