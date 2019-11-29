import React from 'react';
import {
  StyleSheet,
  View,
  Button
} from 'react-native';
import Firebase from './lib/firebase';

export default function App() {

  _onPress = () => {
    let firebase = Firebase.getInstance();
    firebase.getMyNextFeedPost(parameter, nextToken)
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
