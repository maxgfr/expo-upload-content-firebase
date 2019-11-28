import React from 'react';
import {
  StyleSheet,
  View,
  Button
} from 'react-native';

export default function App() {

  _onPress = () => {
    alert('Simple Button pressed');
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
