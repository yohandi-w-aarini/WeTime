import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
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

export default class CreateGroupStackWrapper extends React.Component {
  constructor(props)  {
      super(props);
  }

  render() {
    return (
      <CreateGroupStack screenProps={{ rootNavigation: this.props.navigation }} />
    );
  }
}
