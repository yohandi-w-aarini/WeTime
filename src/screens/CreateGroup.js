import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import CreateGroupInvite from 'WeTime/src/components/CreateGroupInvite';
import CreateGroupName from 'WeTime/src/components/CreateGroupName';
import PhoneNumberSubmit from 'WeTime/src/components/PhoneNumberSubmit';
import PhoneNumberVerify from 'WeTime/src/components/PhoneNumberVerify';

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
    screen: PhoneNumberSubmit,
    navigationOptions: {
      header: null,
    }
  },
  VerifyNumber: {
    screen: PhoneNumberVerify,
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
