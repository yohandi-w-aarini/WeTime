import React, { Component } from 'react';
import { LayoutAnimation, StyleSheet, Dimensions, Text, View, Image, TouchableOpacity } from 'react-native';
import Meteor, { Accounts, withTracker } from 'react-native-meteor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';
import logoImage from 'WeTime/src/images/wetime.logo.png';
import Icon from 'react-native-vector-icons/Ionicons';

var URLSearchParams = require('url-search-params');
var URL = require('url');

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  buttons: {
    flexDirection: 'row',
  },
  error: {
    height: 28,
    justifyContent: 'center',
    width: window.width,
    alignItems: 'center',
  },
  errorText: {
    color: colors.errorText,
    fontSize: 14,
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  logo: {
    width: 125,
    height: 125,
  },
  headerText: {
    fontSize: 30,
    color: colors.headerText,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  subHeaderText: {
    fontSize: 20,
    color: colors.headerText,
    fontWeight: '400',
    fontStyle: 'italic',
  },
});

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.state = {
      firstName:'',
      lastName:'',
      email: '',
      password: '',
      confirmPassword: '',
      confirmPasswordVisible: false,
      consentTerms:false,
      consentSubs:false,
      showSignUp: false,
      error: null,
    };
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    var user = nextProps.currentUser;
    if(user){
      if(user.emails && user.emails.length > 0 && user.emails[0].address){
        this.setState({email:user.emails[0].address});
      }else{
        this.setState({ confirmPasswordVisible: true });
      }
    }
  }

  handleError = (error) => {
    if (this.mounted) {
      this.setState({ error });
    }
  }

  validInput = (overrideConfirm) => {
    const { email, password, confirmPassword, confirmPasswordVisible, consentTerms } = this.state;
    let valid = true;

    if (email.length === 0 || password.length === 0) {
      this.handleError('Email and password cannot be empty.');
      valid = false;
    }

    if (!overrideConfirm && confirmPasswordVisible && password !== confirmPassword) {
      this.handleError('Passwords do not match.');
      valid = false;
    }

    if (confirmPasswordVisible && !consentTerms) {
      this.handleError('You need to accept our terms to proceed');
      valid = false;
    }
    
    if (valid) {
      this.handleError(null);
    }

    return valid;
  }

  handleSignIn = () => {
    if (this.validInput(true)) {
      const { email, password } = this.state;
      Meteor.loginWithPassword(email, password, (error) => {
        if (error) {
          this.handleError(error.reason);
        }
      });
    }
  }

  handleCreateAccount = () => {
    const { email, password, confirmPasswordVisible, firstName, lastName, consentSubs, consentTerms } = this.state;

    if (confirmPasswordVisible && this.validInput()) {
      //check if user is 'trial' user that is invited via sms
      if(this.props.currentUser && !(this.props.currentUser.emails && this.props.currentUser.emails.length > 0 && this.props.currentUser.emails[0].address)){
        var data =  {userId: this.props.currentUser && this.props.currentUser._id, firstName: firstName , lastName: lastName, 
          registerEmail:email, registerPassword:password, consentSubs:consentSubs, 
          consentTerms:consentTerms};

        Meteor.call('signUpInvited', data , (error, result) => {
          if(error){
            console.log(error)
          }else{
            this.handleSignIn();
          }
        });
      }else{
        Accounts.createUser({ email, password }, (error) => {
          if (error) {
            this.handleError(error.reason);
          } else {
            // hack because react-native-meteor doesn't login right away after sign in
            this.handleSignIn();
          }
        });
      }
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      this.setState({ confirmPasswordVisible: true });
    }
  }

  render() {
    if(this.props.dataReady){
      var user = this.props.currentUser;
      return(
        <View style={styles.container}>
          {user 
            ?user.emails && user.emails.length > 0 && user.emails[0].address
              ?
                <View style={styles.header}>
                  <Image
                    style={styles.logo}
                    source={logoImage}
                  />
        
                  <Text style={styles.headerText}>Welcome Back!</Text>
                </View>
              :
                <View style={styles.header}>
                  <Image
                    style={styles.logo}
                    source={logoImage}
                  />
        
                  <Text style={styles.headerText}>Welcome to WeTime!</Text>
                  <Text style={styles.subHeaderText}>just 1 last step</Text>
                </View>
            :
            <View style={styles.header}>
              <Image
                style={styles.logo}
                source={logoImage}
              />
            </View>
          }
  
          <InputWrapper>
            {this.state.confirmPasswordVisible ?
              <GenericTextInput
                placeholder="first name"
                onChangeText={(firstName) => this.setState({ firstName })}
              />
            : null}

            {this.state.confirmPasswordVisible ?
              <GenericTextInput
                placeholder="last name"
                onChangeText={(lastName) => this.setState({ lastName })}
                borderTop
              />
            : null}
            <GenericTextInput
              placeholder="email address"
              onChangeText={(email) => this.setState({ email })}
              borderTop
            />
            <GenericTextInput
              placeholder="password"
              onChangeText={(password) => this.setState({ password })}
              secureTextEntry
              borderTop
            />
            {this.state.confirmPasswordVisible ?
              <GenericTextInput
                placeholder="confirm password"
                onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                secureTextEntry
                borderTop
              />
            : null}

            {this.state.confirmPasswordVisible ?
              <TouchableOpacity style={{
                flexDirection: 'row',
              }} onPress={() => {
                this.setState({ consentTerms:!this.state.consentTerms });
              }}>
                <View style={{
                  flex: 3,
                  alignItems: 'flex-start',
                  justifyContent: 'center'
                }}>
                  <Text>I accept the terms and agreements of WeTime</Text>
                </View>
                <View style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  
                {this.state.consentTerms
                  ? (
                    <Icon name="ios-checkbox" size={30}></Icon>
                  )
                  : (
                    <Icon name="ios-square-outline" size={30}></Icon>
                  )}
                </View>
              </TouchableOpacity>
            : null}

            
          </InputWrapper>
  
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.error}</Text>
          </View>
  
          <View style={styles.buttons}>
            {/* {!user || user && !(user.emails && user.emails.length > 0 && user.emails[0].address) &&
              <Button text="Sign In" onPress={this.handleSignIn} />
            } */}
            <Button text="Sign In" onPress={this.handleSignIn} />
            <Button text="Create Account" onPress={this.handleCreateAccount} />
          </View>
  
          <KeyboardSpacer />
        </View>
      )
    }else{
      return(
        <View style={styles.container}>
          <Text>
              Loading
          </Text>
        </View>
      );
    }
  }
}

export default withTracker((props) => {
  var dataReady;
  var user;
  if(props.screenProps && props.screenProps.appLaunchedByLink){
    const url = URL.parse(props.screenProps.appLaunchedByLink);
    var urlParams = new URLSearchParams(url.search);
    var msisdn = urlParams.get('msisdn');
    var countryCode = urlParams.get('countryCode');

    //convert msisdn back to number by replacing the country code with 0
    //the  +1 for the countryCode length is to compensate for the starting "+" symbol
    var number = "0"+msisdn.substr(countryCode.length+1, msisdn.length);

    var handle = Meteor.subscribe('users',{$and : [ {"mobile.countryCode" : countryCode  }, { "mobile.number" : number}]}, {}, {
      onError: function (error) {
              console.log(error);
          }
    });
    
    if(handle.ready()){
      user = Meteor.collection('users').findOne({$and : [ {"mobile.countryCode" : countryCode  }, { "mobile.number" : number}]});
      dataReady = true;
    }
  }else{
    dataReady = true;
  }
  return {
      dataReady:dataReady,
      currentUser: user
  };
})(SignIn);
