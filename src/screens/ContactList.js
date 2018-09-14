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
import CheckBox from 'react-native-check-box'
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome'
import Contacts from 'react-native-contacts';

import logoImage from 'WeTime/src/images/rn-logo.png';

export default class ContactList extends Component {
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
          console.log('selected:' + item.givenName);
        } else if (item.check === false) {
          const i = this.state.SelectedFakeContactList.indexOf(item)
          if (1 != -1) {
            this.state.SelectedFakeContactList.splice(i, 1)
            console.log('unselect:' + item.givenName)
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
                  <FlatList data={this.state.SelectedFakeContactList} horizontal={true} extraData={this.state} keyExtractor={(item, index) => item.recordID} 
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
            )
            : null
          }
        </View>
        <View>
          <FlatList data={this.state.fakeContact} keyExtractor={item => item.recordID} extraData={this.state} renderItem={({item}) => {
            return <TouchableOpacity style={{
              flexDirection: 'row',
              padding: 10,
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: '#ecf0f1'
            }} onPress={() => {
              this.press(item)
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

ContactList.propTypes = {
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