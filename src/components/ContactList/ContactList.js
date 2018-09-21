import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import Button from 'WeTime/src/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome'
import styles from './styles';

export default class ContactList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fakeContact: [],
      SelectedFakeContactList: []
    }
  }

  componentDidMount() {
    this.setContactState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setContactState(nextProps);
  }

  setContactState(props){
    var contacts;
    if(props.contactsFilter){
      contacts = props.contacts.filter(
        (contact) => {
          return (this.stringMatch(contact.givenName,props.contactsFilter) || this.stringMatch(contact.middleName,props.contactsFilter) || this.stringMatch(contact.familyName,props.contactsFilter));
        });
    }else{
      contacts = props.contacts
    }
    this.setState({
        fakeContact: contacts,
        SelectedFakeContactList: props.contactsSelected
    });
  }

  stringMatch(theString, matchString){
    if (theString && matchString){
      if((theString.toString().toLowerCase()).match((matchString.toString().toLowerCase()))){
        return true;
      }
    }
    return false
  }

  render() {
    if(this.props.contactLoading){
      return (
        <View>
            <Text>
              Loading
            </Text>
        </View>
      )
    }
    else if(this.state.fakeContact.length > 0){
      return (
        <FlatList data={this.state.fakeContact} keyExtractor={item => item.recordID} extraData={this.state} renderItem={({item}) => {
          return <TouchableOpacity style={{
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            borderColor: '#ecf0f1'
          }} onPress={() => {
            this.props.press(item);
          }}>
            <View style={{
              flex: 3,
              alignItems: 'flex-start',
              justifyContent: 'center'
            }}>
              {item.check
                ? (
                  <Text style={{
                    fontWeight: 'bold'
                  }}>{`${item.givenName ? item.givenName : ""} ${item.familyName ? item.familyName : ""}`}</Text>
                )
                : (
                  <Text>{`${item.givenName ? item.givenName : ""} ${item.familyName ? item.familyName : ""}`}</Text>
                )}
            </View>
            <View style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}>
              
            {item.check
              ? (
                <Icon name="ios-checkbox" size={30}></Icon>
              )
              : (
                <Icon name="ios-square-outline" size={30}></Icon>
              )}
            </View>
          </TouchableOpacity>
        }}/>
      )
    }
    else if(!this.props.contactsFilter && this.props.contactPermission){
      return (
        <View>
          <Text>
            You don't have any contact
          </Text>
          <Button text="Try again" onPress={this.props.retry}/>
        </View>
      )
    }else if(!this.props.contactsFilter && !this.props.contactPermission){
      return (
        <View>
          <Text>
            We have no permission to get your contact list
          </Text>
          <Button text="try again" onPress={this.props.retry}/>
        </View>
      )
    }else{
      return (
        <View>
          <Text>
            No results found for '{this.props.contactsFilter}'
          </Text>
        </View>
      )
    }
  };
};

ContactList.propTypes = {
    contacts: PropTypes.array.isRequired,
    contactsSelected: PropTypes.array.isRequired,
    contactLoading: PropTypes.bool.isRequired,
    press: PropTypes.func.isRequired
};