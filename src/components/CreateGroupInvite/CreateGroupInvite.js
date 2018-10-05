import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, PermissionsAndroid } from 'react-native';
import Meteor from 'react-native-meteor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Contacts from 'react-native-contacts';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { BackHandler } from "react-native";
import {name as appName} from 'WeTime/app.json';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';
import HeaderSearch from 'WeTime/src/components/HeaderSearch';
import ContactTab from 'WeTime/src/components/ContactTab';
import ContactListSelected from 'WeTime/src/components/ContactListSelected';


const window = Dimensions.get('window');
const styles = StyleSheet.create({
  containerFooter: {
    height: 50,
    backgroundColor: '#1abc9c',
    padding: 5,
    flexDirection: 'row'
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

class CreateGroupInvite extends Component {
  // _didFocusSubscription;
  // _willBlurSubscription;

  constructor(props) {
    super(props);
    // this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    //   BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    // );

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
      ],
      selectedContactList:[]
    };
  }

  static navigationOptions = ({ navigation }) => {
    var paramGroupName = navigation.getParam('groupName', '');
    if(paramGroupName){
      return {
        headerTitle: <HeaderSearch groupName={paramGroupName} />
      };
    }else{
      return{
        header: null,
      }
    }
    
  };

  componentWillMount() {
    this.mounted = true;
  }

  // componentDidMount(){
    // this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
    //   BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    // );
  // }

  // onBackButtonPressAndroid = () => {
    // if (this.isSelectionModeEnabled()) {
    //   this.disableSelectionMode();
    //   return true;
    // } else {
    //   return false;
    // }
    // console.log("backButtonPressedCreateGRoupInvite");
    // return false;
  // };

  async componentDidMount(){
    await this.getContactSafe();
  }

  componentWillUnmount() {
    this.mounted = false;
    // this._didFocusSubscription && this._didFocusSubscription.remove();
    // this._willBlurSubscription && this._willBlurSubscription.remove();
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
        contactList:contacts.sort(),
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

  press = (hey) => {
    this.state.contactList.map((item) => {
      if (item.recordID === hey.recordID) {
        item.check = !item.check
        if (item.check === true) {
          this.state.selectedContactList.push(item);
        } else if (item.check === false) {
          const i = this.state.selectedContactList.indexOf(item)
          if (1 != -1) {
            this.state.selectedContactList.splice(i, 1)
            return this.state.selectedContactList
          }
        }
      }
    })
    this.setState({contactList: this.state.contactList})
  }

  render() {
    return(
      <View style={{flex: 1}}>
        {(this.state.selectedContactList.length > 0)
          ? (
            <View style={styles.containerFooter}>
              <View style={{
                flex: 3,
                alignItems: 'flex-start',
                justifyContent: 'center',
                alignContent: 'center'
              }}>
              <ContactListSelected contactsSelected={this.state.selectedContactList} press={this.press.bind(this)}/>
              </View>
            </View>
          )
          : null
        }
        <TabView
          style={{flex: 1}}
          navigationState={this.state}
          renderScene={(navigator) => {
            switch (navigator.route.key) {
              case 'contactList':
                return <ContactTab contacts={this.state.contactList}
                contactsSelected={this.state.selectedContactList}
                contactPermission={this.state.contactPermission}
                contactLoading={this.state.contactLoading}
                press={this.press.bind(this)}
                retry={()=>{this.getContactSafe()}}
                navigation={this.props.navigation}
                screenProps={this.props.screenProps}/>;
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
      </View>
    );
  }
}

export default CreateGroupInvite;