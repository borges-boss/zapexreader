import React from 'react';
import Home from '../../Home/Home'
import Barcode from '../../Barcode/Barcode'
import Scanned from '../../Scanned/Scanned'

import {createStackNavigator} from '@react-navigation/stack';

function MainStackNavigator() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Barcode" component={Barcode} />
        <Stack.Screen name="Scanned" component={Scanned} />
      </Stack.Navigator>
  );
}

export default MainStackNavigator;
