/* eslint-disable react/prop-types */
import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import Home from 'WeTime/src/screens/Home';
import SignIn from 'WeTime/src/screens/SignIn';
import CreateGroup from 'WeTime/src/screens/CreateGroup';
import GroupOverview from 'WeTime/src/screens/GroupOverview';

import SidebarMenu from 'WeTime/src/components/SidebarMenu';
import DrawerEvents from 'WeTime/src/components/SidebarMenu/DrawerEvent';

export const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignIn,
  },
}, {
  headerMode: 'none',
});

const DrawerScreens = createDrawerNavigator({
  GroupOverview: {
    screen: GroupOverview,
  },
  CreateGroup: {
    screen: CreateGroup,
    navigationOptions: {
      header: null,
      drawerLockMode:'locked-closed'
    }
  }
},
{
  contentComponent: SidebarMenu,
  drawerWidth: 300
});

export const PrivateStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    }
  },
  CreateGroup: {
    screen: CreateGroup,
    navigationOptions: {
      header: null,
    }
  },
  GroupHome:{
    screen: DrawerScreens,
    navigationOptions: {
      header: null,
    }
  },
},
{
  headerMode: 'screen',
});