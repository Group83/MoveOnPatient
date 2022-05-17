import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager } from "react-native";

//Pages
import Login from './Pages/Login';
import Mood from './Pages/Mood';
import MainPage from './Pages/MainPage';
import Rate from './Pages/Rate';

const Stack = createNativeStackNavigator();

export const languageRestart = async () => {
  //changing language based on what was chosen
  if (I18nManager.isRTL) {
    await I18nManager.forceRTL(false);
  } else {
    if (!I18nManager.isRTL) {
      await I18nManager.forceRTL(true);
      await I18nManager.allowRTL(true);
    }
  }
};

export default function App() {

  //changing language based on what was chosen
  languageRestart();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'
        options={{
          headerBackColor: 'white',
        }}
      >
        <Stack.Screen name='Log in' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Mood' component={Mood} />
        <Stack.Screen name='Main Page' component={MainPage} /> 
        <Stack.Screen name='Rate' component={Rate} />        
      </Stack.Navigator>
    </NavigationContainer >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
