/* eslint-disable react/prop-types */
import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import Home from 'WeTime/src/screens/Home';
import HomeAuth from 'WeTime/src/screens/HomeAuth';
import SignIn from 'WeTime/src/screens/SignIn';
import CreateGroup from 'WeTime/src/screens/CreateGroup';
import GroupOverview from 'WeTime/src/screens/GroupOverview';

import SidebarMenu from 'WeTime/src/components/SidebarMenu';

export const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignIn,
  },
}, {
  headerMode: 'none',
});

// export const PublicStack = createDrawerNavigator({
//   Home: {
//     screen: Home,
//     header:null
//   },
//   SignIn: {
//     screen: SignIn,
//   },
// });

const DrawerScreens = createDrawerNavigator({
  GroupOverview: {
    screen: GroupOverview,
  },
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
  GroupHome:{
    screen: DrawerScreens,
    navigationOptions: {
      header: null,
    }
  },
  CreateGroup: {
    screen: CreateGroup,
  }
},
{
  headerMode: 'screen',
});

// export const AppNavigatorPrivate = createStackNavigator({
//   PrivateStack: { 
//     screen: PrivateStack,
//     // navigationOptions: {
//     //   drawer: () => ({
//     //     label: 'Foo',
//     //     icon: ({ tintColor }) => (
//     //       <Icon name="credit-card" size={22} color={tintColor} />
//     //     ),
//     //   })
//     // },
//   },
//   PrivateStackDrawer: { 
//     screen: PrivateStackDrawer,
//     // navigationOptions: {
//     //   drawer: () => ({
//     //     label: 'Bar',
//     //     icon: ({ tintColor }) => (
//     //       <Icon name="tag" size={22} color={tintColor} />
//     //     ),
//     //   })
//     // },
//   }
// }, {
//   headerMode: 'none',
// });


// export const AppNavigatorPrivate = createStackNavigator({
//   Drawer: { screen: MyDrawerNavigator },
// }, {
//   headerMode: 'none',
// });

