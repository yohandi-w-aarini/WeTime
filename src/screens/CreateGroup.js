import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, PermissionsAndroid } from 'react-native';
import Meteor from 'react-native-meteor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Contacts from 'react-native-contacts';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import {name as appName} from 'WeTime/app.json';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';
import HeaderSearch from 'WeTime/src/components/HeaderSearch';
import ContactTab from './ContactTab';


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
  }
});

class CreateGroup extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.state = {
      contactPermission:undefined,
      contactList:[],
      contactLoading:false,
      error: null,
      index: 0,
      routes: [
        { key: 'contactList', title: 'Contact List' },
        { key: 'email', title: 'Email' },
      ]
    };
  }

  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <HeaderSearch />,
  };

  componentWillMount() {
    this.mounted = true;
  }

  async componentDidMount(){
    await this.getContactSafe();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleError = (error) => {
    if (this.mounted) {
      this.setState({ error });
    }
  }

  validInput = (overrideConfirm) => {
    const { email, password, confirmPassword, confirmPasswordVisible } = this.state;
    let valid = true;

    if (email.length === 0 || password.length === 0) {
      this.handleError('Email and password cannot be empty.');
      valid = false;
    }

    if (!overrideConfirm && confirmPasswordVisible && password !== confirmPassword) {
      this.handleError('Passwords do not match.');
      valid = false;
    }

    if (valid) {
      this.handleError(null);
    }

    return valid;
  }

  getContact(){
    this.setState({ contactLoading:true });
    Contacts.getAll((err, contacts) => {
      if (err) throw err;
  
      // contacts returned
      this.setState({ 
        contactList:contacts,
        contactPermission:true,
        contactLoading:false });
    })
  }

  async getContactSafe(){
    const permission = await this.checkContactPermission();

    if(permission){
      this.getContact();
    }else if(permission === false){
      await this.requestContactPermission();
    }else{
      console.log("error with permission check");
      this.setState({ contactPermission:false })
    }
  }

  async requestContactPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': `${appName} Contact Permission`,
          'message': `${appName} needs access to your contact list ` +
                     'to help you invite people easily',
          'buttonPositive': "OK"
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getContact();
      } else {
        this.setState({ contactPermission:false });
      }
    } catch (err) {
      console.warn(err)
    }
  }

  async checkContactPermission() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err)
      return undefined;
    }
  }

  render() {
    return(
      <TabView
        navigationState={this.state}
        renderScene={(navigator) => {
          switch (navigator.route.key) {
            case 'contactList':
              return <ContactTab contacts={this.state.contactList} 
              contactPermission={this.state.contactPermission}
              contactLoading={this.state.contactLoading}
              retry={()=>{this.getContactSafe()}}/>;
            case 'email':
              return <View style={[{ backgroundColor: '#673ab7' }]} />;
            default:
              return null;
            }
          }
        }
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
      />
    );
  }
}

export default CreateGroup;
