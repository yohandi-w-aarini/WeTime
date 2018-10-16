import React, { Component } from 'react';
import { LayoutAnimation, StyleSheet, Dimensions, Text, View, Image, TouchableOpacity } from 'react-native';
import Meteor, { Accounts, withTracker } from 'react-native-meteor';
import firebase from 'react-native-firebase';
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
      defaultEmailValue: undefined,
    };
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    if(props.screenProps && props.screenProps.onLinkFromSms){
      //calling the function to unsubscribe from future onLink event
      props.screenProps.onLinkFromSms();
    }
  }

  componentWillReceiveProps(nextProps) {
    var user = nextProps.currentUser;

    var timestampOnLinkClickPrev = this.props.screenProps && this.props.screenProps.smsLinkClickTimestamp;
    var timestampOnLinkClick = nextProps.screenProps && nextProps.screenProps.smsLinkClickTimestamp;
    
    //add check so it only run when needed e.g.:
    //the fist occurense of app is opened by link or when link is clicked while the app is open
    //link is clicked while app is open (using timestamps to differentiate each click)
    if(user && 
        (
          !this.props.currentUser || 
          !timestampOnLinkClickPrev || 
          (timestampOnLinkClickPrev && timestampOnLinkClick && timestampOnLinkClick > timestampOnLinkClickPrev)
        )
      ){
      //if user has email (verified user)
      if(user.emails && user.emails.length > 0 && user.emails[0].address){
        this.setState({ 
          firstName:'',
          lastName:'',
          email:user.emails[0].address,
          defaultEmailValue:user.emails[0].address,
          password: '',
          confirmPassword: '',
          confirmPasswordVisible: false 
        });
      }
      //user has no email (new user coming from sms invite)
      else{
        this.setState({ 
          firstName:'',
          lastName:'',
          email: '',
          defaultEmailValue:undefined,
          password: '',
          confirmPassword: '',
          confirmPasswordVisible: true });
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

  signInClick(){
    if(this.state.confirmPasswordVisible){
      this.setState({ 
        firstName:'',
        lastName:'',
        email: '',
        defaultEmailValue:undefined,
        password: '',
        confirmPassword: '',
        confirmPasswordVisible: false });
    }else{
      this.handleSignIn();
    }
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
      this.setState({ 
        firstName:'',
        lastName:'',
        email: '',
        defaultEmailValue:undefined,
        password: '',
        confirmPassword: '',
        confirmPasswordVisible: true });
    }
  }

  render() {
    if(this.props.dataReady){
      var user = this.props.currentUser;
      return(
        <View style={styles.container}>
          {user 
            ?user.emails && user.emails.length > 0 && user.emails[0].address
              ?this.state.defaultEmailValue 
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
              defaultValue={this.state.defaultEmailValue}
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
            {(!user || (user && user.emails && user.emails.length > 0 && user.emails[0].address)) &&
              <Button text="Sign In" onPress={this.signInClick.bind(this)} />
            }
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
  if(props.screenProps && (props.screenProps.appLaunchedByLink || props.screenProps.smsLink)){
    var url;
    if(props.screenProps.smsLink){
      url = URL.parse(props.screenProps.smsLink);
    }else{
      url = URL.parse(props.screenProps.appLaunchedByLink);
    }
    
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
