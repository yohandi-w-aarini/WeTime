import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  main: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.headerText,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default class GroupOverview extends Component {
  static navigationOptions = {
    drawerLabel: 'myFirstGroup',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('WeTime/assets/RNFirebase.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };
  render(){
      console.log("hello from GroupOverview  render");
      console.log(this.props.group);
    return(
        <View style={styles.container}>
        <Text style={styles.main}>
            group stuff here
        </Text>
        </View>
    );
  }
};