import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, PermissionsAndroid } from 'react-native';
import Meteor from 'react-native-meteor';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';

import IconFA from 'react-native-vector-icons/FontAwesome'

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
        <View style={{flexDirection:'row', justifyContent:'center', margin:30}}>
          <IconFA
            name="camera-retro"
            color="black"
            size={100}
          />
        </View>
        <View style={{justifyContent:'center'}}>
          <GenericTextInput
          placeholder="team name"
          onChangeText={(groupName) => this.setState({ groupName })}
          />
          <Text style={{textAlign:'center'}}>
            Create a name for your team and add an optional image
          </Text>
          <Button text="Next" onPress={()=>{
              this.props.navigation.navigate('SetGroupMember', {groupName:this.state.groupName});
          }}/>
        </View>
      </View>
    );
  }
}

export default CreateGroupName;