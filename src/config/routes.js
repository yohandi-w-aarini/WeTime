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
},
{
  contentComponent: SidebarMenu,
  drawerWidth: 300
});

const CreateGroupStack = createStackNavigator({
  CreateGroup: {
    screen: CreateGroup,
    navigationOptions: {
      header: null,
    }
  }
},
{
  headerMode: 'screen',
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
    navigationOptions: {
      header: null,
    }
  }
},
{
  headerMode: 'screen',
});

const defaultGetStateForAction = PrivateStack.router.getStateForAction;

PrivateStack.router.getStateForAction = (action, state) => {
  // console.log("ACTION");
  // console.log(action);
  // console.log("STATE");
  // console.log(state);
  // console.log(action);
  // if(action.type == "Navigation/COMPLETE_TRANSITION" && state && state.routes && state.routes.length > 0
  // && state.routes[0].routeName == 'GroupHome'){
  //   console.log("SET DRAWER CLOSE");
  //   var currentParam = state.routes[(state.routes.length-1)].params;
  //   if(currentParam){
  //     currentParam.closeDrawer = true;
  //   }else{
  //     currentParam = {closeDrawer:true};
  //   }
  //   state.routes[(state.routes.length-1)].params = currentParam;
  // }

  if(action.type == "Navigation/DRAWER_CLOSED" && state && state.routes && state.routes.length > 0 && state.routes[(state.routes.length-1)].routeName != 'GroupHome'){
    console.log("RETURN NULL");
    return null;
  }
  if(action.type == "Navigation/DRAWER_CLOSED" && state && state.routes && state.routes.length > 0 && state.routes[(state.routes.length-1)].routeName == 'GroupHome'){
    DrawerEvents.notify('DRAWER_CLOSED');
  }
  // console.log(state);
  return defaultGetStateForAction(action, state);
};
