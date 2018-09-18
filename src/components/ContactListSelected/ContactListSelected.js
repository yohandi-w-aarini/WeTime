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
    console.log(this.state.SelectedFakeContactList);
    return (
      <View style={styles.containerFooter}>
        <View style={{
          flex: 3,
          alignItems: 'flex-start',
          justifyContent: 'center',
          alignContent: 'center'
        }}>
          <FlatList data={this.state.SelectedFakeContactList} horizontal={true} keyExtractor={(item, index) => item.recordID} 
          renderItem={({item, index}) => {
            return <TouchableOpacity 
            onPress={() => {
              this.press(item)
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

        </View>
      </View>
    );
  };
};

ContactList.propTypes = {
    contactsSelected: PropTypes.array.isRequired,
    press: PropTypes.func.isRequired
};