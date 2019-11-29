import React from 'react';
import {
  StyleSheet,
  View,
  Button
} from 'react-native';
import Firebase from './lib/firebase';
import * as DocumentPicker from 'expo-document-picker';
import * as mime from 'react-native-mime-types';

export default function App() {

  _onPressDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    console.log('result', result);
    if (!result.cancelled) {
      this.addToFirebase(result.uri, result.name)
    }
  }

  addToFirebase = (uri, name) => {
    var extension = uri.split('.').pop();
    var contentType = mime.lookup(extension);
    let firebase = Firebase.getInstance();
    firebase.storeItem('new/', uri, name, contentType)
      .then((res) => {
          console.log(res);
      })
      .catch((error) => {
          console.log(error);
      });
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
          title="Upload content"
          onPress={this._onPress}
          style={styles.button}
        />
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
