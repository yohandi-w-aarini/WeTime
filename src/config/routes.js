/* eslint-disable react/prop-types */
import React from 'react';
import { Image } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

import Home from 'WeTime/src/screens/Home';
import HomeAuth from 'WeTime/src/screens/HomeAuth';
import SignIn from 'WeTime/src/screens/SignIn';


export const AuthStack = StackNavigator({
  SignIn: {
    screen: SignIn,
  },
}, {
  headerMode: 'none',
});

export const PublicStack = StackNavigator({
  Home: {
    screen: Home,
    header:null
  },
  SignIn: {
    screen: SignIn,
  }
});

export const PrivateStack = StackNavigator({
    HomeAuth: {
      screen: HomeAuth,
      header:null
    }
  });