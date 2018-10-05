import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, PermissionsAndroid } from 'react-native';
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
      number: '',
    };
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <View style={{justifyContent:'center'}}>
          <Text style={{textAlign:'center'}}>
            Before we proceed...
          </Text>
          <Text style={{textAlign:'center'}}>
            Please help us confirm your identity by entering your phone number here.
          </Text>
          <GenericTextInput
          placeholder="06"
          onChangeText={(number) => this.setState({ number })}
          />
          
          <Button text="Next" onPress={()=>{
              this.props.navigation.navigate('VerifyNumber', {number:this.state.number});
          }}/>
        </View>
      </View>
    );
  }
}

export default CreateGroupName;