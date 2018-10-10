import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import CreateGroupInvite from 'WeTime/src/components/CreateGroupInvite';
import CreateGroupName from 'WeTime/src/components/CreateGroupName';
import CreateGroupPhoneNumberSubmit from 'WeTime/src/components/CreateGroupPhoneNumberSubmit';
import CreateGroupPhoneNumberVerify from 'WeTime/src/components/CreateGroupPhoneNumberVerify';

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
  SubmitNumber: {
    screen: CreateGroupPhoneNumberSubmit,
    navigationOptions: {
      header: null,
    }
  },
  VerifyNumber: {
    screen: CreateGroupPhoneNumberVerify,
    navigationOptions: {
      header: null,
    }
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
