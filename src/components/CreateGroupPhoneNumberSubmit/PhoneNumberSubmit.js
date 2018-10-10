import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, Picker } from 'react-native';
import Meteor from 'react-native-meteor';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';

import IconFA from 'react-native-vector-icons/FontAwesome'

class CreateGroupName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:undefined,
      countryCode: '',
      number: '',
      selectedContactList:[]
    };
  }

  componentDidMount(){
    this.setState({
      selectedContactList:this.props.navigation.getParam('selectedContactList', [])
    });
  }

  render() {
    if(this.state.loading){
      return(
        <View style={{flex: 1}}>
          <Text>
              Loading
          </Text>
        </View>
      );
    }
    return(
      <View style={{flex: 1}}>
        <View style={{justifyContent:'center'}}>
          <Text style={{textAlign:'center'}}>
            Before we proceed...
          </Text>
          <Text style={{textAlign:'center'}}>
            Please help us confirm your identity by entering your phone number here.
          </Text>
          <View style={{justifyContent:'center'}}>
            <Picker
              selectedValue={this.state.countryCode}
              onValueChange={(itemValue, itemIndex) => this.setState({countryCode: itemValue})}>
              <Picker.Item label="United States (+1)" value="1" />
              <Picker.Item label="Netherlands (+31)" value="31" />
              <Picker.Item label="Indonesia (+62)" value="62" />
            </Picker>
            <GenericTextInput
            placeholder="phone number"
            onChangeText={(number) => this.setState({ number })}
            />
          </View>
         
          <Button text="Next" onPress={()=>{
            this.setState({loading:true});
            Meteor.call('send.verification.sms',this.state.countryCode,this.state.number, (error, response)=>{
              if(error){
                console.log(error);
              }
              this.setState({loading:false});
              this.props.navigation.navigate('VerifyNumber', {number:this.state.number,countryCode:this.state.countryCode,selectedContactList:this.state.selectedContactList});
            });
          }}/>
        </View>
      </View>
    );
  }
}

export default CreateGroupName;