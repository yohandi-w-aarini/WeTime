/* eslint-disable react/prop-types */
import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator, DrawerNavigator } from 'react-navigation';

import Home from 'WeTime/src/screens/Home';
import HomeAuth from 'WeTime/src/screens/HomeAuth';
import SignIn from 'WeTime/src/screens/SignIn';
import CreateGroup from 'WeTime/src/screens/CreateGroup';


export const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignIn,
  },
}, {
  headerMode: 'none',
});

export const PublicStack = DrawerNavigator({
  Home: {
    screen: Home,
    header:null
  },
  SignIn: {
    screen: SignIn,
  },
});

export const PrivateStack = createStackNavigator({
    Home: {
      screen: Home,
    },  
    CreateGroup: {
      screen: CreateGroup,
    }
  });