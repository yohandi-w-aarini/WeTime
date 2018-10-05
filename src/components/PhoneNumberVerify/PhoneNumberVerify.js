import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, PermissionsAndroid } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';
import CreateGroupInvite from 'WeTime/src/components/CreateGroupInvite';

import IconFA from 'react-native-vector-icons/FontAwesome'

class CreateGroupName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verification: '',
    };
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <View style={{justifyContent:'center'}}>
          <Text style={{textAlign:'center'}}>
            We just sent you a verification code! Please enter them below:
          </Text>
          <GenericTextInput
          placeholder="verification code"
          onChangeText={(verification) => this.setState({ verification })}
          />
          <Button text="Next" onPress={()=>{
            //get back to parent
            const resetAction = StackActions.reset({
              index: 0, 
              key: null,
              actions: [
                  NavigationActions.navigate({ routeName: 'Home' })
              ],
            });
            if(this.props.screenProps && this.props.screenProps.rootNavigation){
              this.props.screenProps.rootNavigation.dispatch(resetAction);
            }
          }}/>
        </View>
      </View>
    );
  }
}

export default CreateGroupName;