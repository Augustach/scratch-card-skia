import React from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';
import {Scratch} from './Scratch';

const Placeholder = () => (
  <Image
    source={require('./placeholder.png')}
    resizeMode="contain"
    style={styles.placeholder}
  />
);

const int = (size: number) => Math.floor(size);

const randomImageUri = ({size}: {size: number}) =>
  `https://loremflickr.com/${int(size)}/${int(size)}/cats`;

const App = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <Scratch
        style={styles.container}
        uri={randomImageUri}
        placeholder={Placeholder}
        strokeWidth={50}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: '100%',
    height: '100%',
  },
});

export default App;
