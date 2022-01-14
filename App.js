import React from 'react';
import type {Node} from 'react';
import {DefaultTheme} from 'react-native-paper';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import MainStackNavigator from './modules/Screens/Main/MainStackNavigator/MainStackNavigator'

//Global vars
global.scannedBarcode = []; 
global.codesFetched = [];


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    text: '#262626',
    primary: '#034F77',
    card: '#fff',
    accent: '#E86024',
    background: '#fff',
    error: '#B80000',
  },
};

const App: () => Node = () => {

  return (
    <NavigationContainer style={styles.container} theme={theme}>
        <MainStackNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container:{
    padding:8,
    backgroundColor:"#fff"
    
  },
});

export default App;
