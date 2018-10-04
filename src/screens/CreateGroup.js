import React, { Component } from 'react';
import { createStackNavigator, DrawerActions } from 'react-navigation';
import CreateGroupInvite from 'WeTime/src/components/CreateGroupInvite';
import CreateGroupName from 'WeTime/src/components/CreateGroupName';

const CreateGroupStack = createStackNavigator({
  SetGroupName: {
    screen: CreateGroupName,
    navigationOptions: {
      header: null,
    }
  },
  SetGroupMember: {
    screen: CreateGroupInvite,
  },
});

const defaultGetStateForAction = CreateGroupStack.router.getStateForAction;

// CreateGroupStack.router.getStateForAction = (action, state) => {
//   console.log("action from createGroupStack");
//   console.log(action);
//   console.log("state from createGroupStack");
//   console.log(state);
//   return defaultGetStateForAction(action, state);
// };

export default class CreateGroupStackWrapper extends React.Component {
  constructor(props)  {
      super(props);
  }
  // componentDidMount(){
  //   console.log(this.props.navigation.getParam('closeDrawer', 'NOPE'));
  //   var closeDrawer = this.props.navigation.getParam('closeDrawer', false);
  //   if(closeDrawer){
  //     this.props.navigation.setParams({ closeDrawer: false });
  //     this.props.navigation.dispatch(DrawerActions.closeDrawer());
  //   }
  // }

  render() {
    return (
      <CreateGroupStack screenProps={{ rootNavigation: this.props.navigation }} />
    );
  }
}
