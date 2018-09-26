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
  render(){
    return(
      //this.props.groupOverviewStack
        <View style={styles.container}>
          <Text style={styles.main}>
            Group home with drawer navigation here
          </Text>
          <Text style={styles.main}>
            Group name: {this.props.selectedGroup.groupName}
          </Text>
        </View>
    );
  }
};

GroupOverview.propTypes = {
  selectedGroup: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
};