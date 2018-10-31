import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StackActions, NavigationActions  } from 'react-navigation';
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
});

class NotificationHandler extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    if(this.props.screenProps && this.props.screenProps.notification){
        return (
            <View style={styles.container}>
                <Text style={styles.main}>
                Hi!, do you have time for WeTime?
                </Text>
            </View>
        );
    }else{
        return (
            <View style={styles.container}>
              <Text style={styles.main}>
                error! notification object not found
              </Text>
            </View>
        );
    }
  }
};

var notificationHandler = withTracker((props) => {
  var user = Meteor.user();
  return {
    currentUser: user,
  };
})(NotificationHandler);

class SetLocation extends Component {
    constructor(props) {
      super(props);
    }
  
    render(){
      return (
          <View style={styles.container}>
            <Text style={styles.main}>
              GReat! now set your location
            </Text>
          </View>
      );
    }
  };
  
var setLocation = withTracker((props) => {
    var user = Meteor.user();
    return {
        currentUser: user,
    };
})(SetLocation);

const WeTimeActionStack = createStackNavigator({
    NotificationHandler: {
      screen: notificationHandler,
      navigationOptions: {
        header: null,
      }
    },
    SetLocation: {
      screen: setLocation,
      navigationOptions: {
        header: null,
      }
    }
  });

    const WeTimeActionStackPositive = createStackNavigator({
        NotificationHandler: {
            screen: notificationHandler,
            navigationOptions: {
            header: null,
            }
        },
        SetLocation: {
            screen: setLocation,
            navigationOptions: {
            header: null,
            }
        }
        },{
        initialRouteName : 'SetLocation'
        }
    );
  
  export default class WeTimeActionStackWrapper extends React.Component {
    constructor(props)  {
        super(props);
    }
  
    render() {
        if(!this.props.notification.action){
            return (
                <WeTimeActionStack screenProps={{ rootNavigation: this.props.navigation, notification:this.props.notification }} />
            );
        }else if(this.props.notification.action && this.props.notification.action == "action_positive"){
            return (
                <WeTimeActionStackPositive screenProps={{ rootNavigation: this.props.navigation, notification:this.props.notification }} />
            );
        }
        
    }
  }
  