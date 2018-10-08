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
      error:undefined,
      loading:false,
      countryCode:'',
      number:'',
      verification: '',
    };
  }

  componentDidMount(){
    this.setState({
      countryCode:this.props.navigation.getParam('countryCode', ''),
      number:this.props.navigation.getParam('number', '')
    });
  }

  resendVerification(){
    this.setState({
      error:undefined,
      loading:true
    });
    Meteor.call('send.verification.sms',this.state.countryCode,this.state.number, (error, response)=>{
      if(error){
        console.log(error);
      }
      this.setState({
        error:error,
        loading:false
      });
    });
  }

  verifyNumber(){
    if(!this.state.loading){
      this.setState({
        error:undefined,
        loading:true
      });
      Meteor.call('verify.number',this.state.countryCode,this.state.number, this.state.verification, (error, response)=>{
        if(error){
          console.log(error);
          this.setState({
            error:error,
            loading:false
          });
        }else{
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
        }
      });
    }
  }

  render() {
    if(this.state.loading){
      return(
        <View style={{flex: 1}}>
          <Text>
              Loading
          </Text>
        </View>
      )
    }else{
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
            <Text style = {{textAlign:'center'}}>
              No sms yet? 
              <Text onPress={this.resendVerification.bind(this)} style = {{ color: '#2B6CC4' }}>
              Click here
              </Text> 
               to try again
            </Text>
            <Button text="Next" onPress={this.verifyNumber.bind(this)}/>
  
            {this.state.error &&
              <Text style={{textAlign:'center',color:'#fc0000'}}>
              Sorry, that didn't work. Please try again.
              </Text>
            }
          </View>
        </View>
      );
    }
  }
}

export default CreateGroupName;