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
    this.setState({
        fakeContact: this.props.contacts,
        SelectedFakeContactList: this.props.contactsSelected
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        fakeContact: nextProps.contacts,
        SelectedFakeContactList: nextProps.contactsSelected
    });
  }

  render() {
    return (
        (this.props.contactLoading) 
        ?
          <View>
            <Text>
              Loading
            </Text>
          </View>
        :(this.state.fakeContact.length > 0)
          ?
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
                    }}>{`${item.familyName} ${item.givenName}`}</Text>
                  )
                  : (
                    <Text>{`${item.familyName} ${item.givenName}`}</Text>
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
          :this.props.contactPermission 
            ?
            <View>
              <Text>
                You don't have any contact
              </Text>
              <Button text="Try again" onPress={this.props.retry}/>
            </View>
            :
            <View>
              <Text>
                We have no permission to get your contact list
              </Text>
              <Button text="try again" onPress={this.props.retry}/>
            </View>
    );
  };
};

ContactList.propTypes = {
    contacts: PropTypes.array.isRequired,
    contactsSelected: PropTypes.array.isRequired,
    contactLoading: PropTypes.bool.isRequired,
    press: PropTypes.func.isRequired
};