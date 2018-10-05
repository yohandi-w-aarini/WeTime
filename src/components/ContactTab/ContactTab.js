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
import { NavigationActions, StackActions } from 'react-navigation';
import Button from 'WeTime/src/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome'
import ContactList from 'WeTime/src/components/ContactList';
import SearchBar from 'WeTime/src/components/SearchBar';

export default class ContactTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fakeContact: [],
      SelectedFakeContactList: [],
      filter:undefined
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

  setSearchFilter(query){
    this.setState({
      filter: query,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
        <SearchBar
            style={{flex: 1}}
            placeholder="Search your contacts"
            onChangeText={this.setSearchFilter.bind(this)}
            removeFilter={this.setSearchFilter.bind(this)}
        />
        <ContactList 
        contacts={this.state.fakeContact}
        contactsSelected={this.state.SelectedFakeContactList}
        contactPermission={this.props.contactPermission}
        contactLoading={this.props.contactLoading}
        contactsFilter={this.state.filter}
        press={this.props.press}/>
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
          }} onPress={() => {
           
            //go to phone number verification
            //OR
            //get back to parent
            this.props.navigation.navigate('SubmitNumber', {number:this.state.number});
            // const resetAction = StackActions.reset({
            //   index: 0, 
            //   key: null,
            //   actions: [
            //       NavigationActions.navigate({ routeName: 'Home' })
            //   ],
            // });
            // if(this.props.screenProps && this.props.screenProps.rootNavigation){
            //   this.props.screenProps.rootNavigation.dispatch(resetAction);
            // }
          }}>

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
  contactsSelected: PropTypes.array.isRequired,
  press: PropTypes.func.isRequired,
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