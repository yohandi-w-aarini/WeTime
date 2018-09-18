import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, PermissionsAndroid } from 'react-native';
import Meteor from 'react-native-meteor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Contacts from 'react-native-contacts';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import {name as appName} from 'WeTime/app.json';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';
import HeaderSearch from 'WeTime/src/components/HeaderSearch';
import ContactTab from './ContactTab';

class CreateGroup extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.state = {
      contactPermission:undefined,
      contactList:[],
      contactLoading:false,
      error: null,
      enterGroupName:false
    };
  }

  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <HeaderSearch />,
  };

  onBackButtonPressAndroid(){
    /*
    *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
    *   and react-navigation's lister will not get called, thus not popping the screen.
    *
    *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
    * */

    if (youWantToHandleTheBackButtonPress) {
      // do something
      return true;
    } else {
      return false;
    }
  };

  render() {
    return(
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid.bind(this)}>
        <ContactTab/>
      </AndroidBackHandler>
    );
  }
}

export default CreateGroup;
