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

export default class ContactListSelected extends Component {
  constructor(props) {
    super(props)

    this.state = {
      SelectedFakeContactList: []
    }
  }

  componentDidMount() {
    this.setState({
        SelectedFakeContactList: this.props.contactsSelected
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        SelectedFakeContactList: nextProps.contactsSelected
    });
  }

  render() {
    return (
      <FlatList data={this.state.SelectedFakeContactList} horizontal={true} extraData={this.state} keyExtractor={(item, index) => item.recordID} 
      renderItem={({item, index}) => {
        return <TouchableOpacity 
        onPress={() => {
          this.props.press(item)
        }}
        style={{
          paddingTop: 10,
          flexDirection:"row",
          marginRight:5
        }}>
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            padding: 2,
          }}>{`${item.givenName}`}
          </Text>
          <IconFA
            name="remove"
            color="white"
            size={15}
          />
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
          }}>,
          </Text>
        </TouchableOpacity>
      }}/>
    );
  };
};

ContactListSelected.propTypes = {
    contactsSelected: PropTypes.array.isRequired,
    press: PropTypes.func.isRequired
};