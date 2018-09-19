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
import ContactList from 'WeTime/src/components/ContactList';
import ContactListSelected from 'WeTime/src/components/ContactListSelected';
import SearchBar from 'WeTime/src/components/SearchBar';

export default class ContactTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fakeContact: [],
      SelectedFakeContactList: []
    }
  }

  press = (hey) => {
    this.state.fakeContact.map((item) => {
      if (item.recordID === hey.recordID) {
        item.check = !item.check
        if (item.check === true) {
          this.state.SelectedFakeContactList.push(item);
        } else if (item.check === false) {
          const i = this.state.SelectedFakeContactList.indexOf(item)
          if (1 != -1) {
            this.state.SelectedFakeContactList.splice(i, 1)
            return this.state.SelectedFakeContactList
          }
        }
      }
    })
    this.setState({fakeContact: this.state.fakeContact})
  }

  _showSelectedContact() {
    return this.state.SelectedFakeContactList.length;
  }

  componentDidMount() {
    this.setState({fakeContact: this.props.contacts.sort()});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({fakeContact: nextProps.contacts.sort()});
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          {(this.state.SelectedFakeContactList.length > 0)
            ? (
              <View style={styles.containerFooter}>
                <View style={{
                  flex: 3,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  alignContent: 'center'
                }}>
                <ContactListSelected contactsSelected={this.state.SelectedFakeContactList} press={this.press.bind(this)}/>
                </View>
              </View>
            )
            : null
          }
        </View>
        <View>
        <SearchBar
            placeholder="Search your contacts"
            onChangeText={(query) => console.log(query)}
        />
        <ContactList 
        contacts={this.state.fakeContact}
        contactsSelected={this.state.SelectedFakeContactList}
        contactLoading={this.props.contactLoading}
        press={this.press.bind(this)}/>
        </View>
        
        {(this.state.SelectedFakeContactList.length > 0)
        ?
        (
          <TouchableOpacity style={{
            position: 'absolute',
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            right: 30,
            bottom: 30,
            backgroundColor: '#1abc9c',
          }} onPress={() => Alert.alert('Message sent :)')}>

          <IconFA
            name="arrow-right"
            color="white"
            size={30}
          />
          </TouchableOpacity>
        )
        :
        null
        }
      </View>
    );
  };
};

ContactTab.propTypes = {
  contacts: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 0
  },
  containerFooter: {
    height: 50,
    backgroundColor: '#1abc9c',
    padding: 5,
    flexDirection: 'row'
  },
});