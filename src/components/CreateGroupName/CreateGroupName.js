import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, PermissionsAndroid } from 'react-native';
import Meteor from 'react-native-meteor';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';
import CreateGroupInvite from 'WeTime/src/components/CreateGroupInvite';

class CreateGroupName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
    };
  }

  render() {
    return(
        <View style={{flex: 1}}>
            <GenericTextInput
            placeholder="team name"
            onChangeText={(groupName) => this.setState({ groupName })}
            />
            <Button text="Next" onPress={()=>{
                this.props.navigation.navigate('SetGroupMember', {groupName:this.state.groupName});
            }}/>
        </View>
    );
  }
}

export default CreateGroupName;