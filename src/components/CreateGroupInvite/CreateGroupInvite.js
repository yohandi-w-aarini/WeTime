import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, PermissionsAndroid } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Meteor, {withTracker} from 'react-native-meteor';
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
import { generateCreateGroupData } from 'WeTime/src/components/Utils';


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

  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      contactPermission:undefined,
      contactList:[],
      contactLoading:false,
      error: null,
      index: 0,
      creatingGroup:false,
      routes: [
        { key: 'contactList', title: 'Contact List' },
        { key: 'email', title: 'Email' },
      ],
      selectedContactList:[]
    };
  }

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
    Contacts.getAll((error, contacts) => {
      if (error) throw error;
  
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
    } catch (error) {
      console.warn(error)
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
    } catch (error) {
      console.warn(error)
      return undefined;
    }
  }

  async sendInvitation(){
     //check if number already verified
     if(this.props.currentUser && this.props.currentUser.mobile && this.props.currentUser.mobile.length > 0 &&
      this.props.currentUser.mobile[0].countryCode && this.props.currentUser.mobile[0].number && this.props.currentUser.mobile[0].verified){
        //skip phone verification
        //create group, send sms invite and return to parent

        this.setState({ creatingGroup:true });

        var groupName = this.props.navigation.getParam('groupName', '');
        var arrayEmails = []
        var arrayNumbers = await generateCreateGroupData(this.props.currentUser.mobile[0].countryCode,this.state.selectedContactList);
        
        Meteor.call('createGroupWeTime', groupName, arrayEmails, arrayNumbers, (error, result) => {
          if(error){
            console.log(error)
            this.setState({ creatingGroup:false });
          }else{
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
    }else{
      //do phone verification
      this.props.navigation.navigate('SubmitNumber',{selectedContactList:this.state.selectedContactList});
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
    if(this.props.currentUser){
      if(this.state.creatingGroup){
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
                  sendInvitation={this.sendInvitation.bind(this)}/>;
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
    else{
      return (null);
    }
  }
}

const createGroupInviteContainer = withTracker((props) => {
  return {
      currentUser: Meteor.user()
  };
})(CreateGroupInvite);

createGroupInviteContainer.navigationOptions = ({ navigation }) => {
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

export default createGroupInviteContainer;