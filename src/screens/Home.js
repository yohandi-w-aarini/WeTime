import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import Meteor, { withTracker } from 'react-native-meteor';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GroupOverview from './GroupOverview';

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

class Home extends Component {
  render(){
    if(this.props.dataReady){
      if(this.props.groups.length > 0 && this.props.groupOverviewStack){
        //show group home screen
        return(
          //this.props.groupOverviewStack
          <View style={styles.container}>
            <Text style={styles.main}>
              Group home with drawer navigation here
            </Text>
          </View>
        );
      }else{
        //show welcome
        return(
          <View style={styles.container}>
            <Text style={styles.main}>
              Welcome to WeTime!
            </Text>
            <Text style={styles.main}>
              You don't currently have any team. Let's set one up!
            </Text>
            <Button text="Create a Team" onPress={() => this.props.navigation.navigate('CreateGroup', {navigation:this.props.navigation})}/>
          </View>
        );
      }
    }else{
      return (
        <View style={styles.container}>
          <Text style={styles.main}>
            loading
          </Text>
        </View>
      );
    }
    
  }
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default withTracker((props) => {
  var user = Meteor.user();
  var dataReady = false;
  var groups = [];
  var groupOverviewStack;

  if(user){
    const handle = Meteor.subscribe('group',{
        
        $or : [
          {creatorId : user._id}, 
          {"userIds" : user._id}
        ]
    },{}, {
        onError: function (error) {
              console.log(error);
          }
    });

    if(handle.ready()){
        groups =  Meteor.collection('group').find();
        // var screenMapping={};
        if(groups.length > 0){
          
          // groups.forEach((group,index) => {
          //   screenMapping["GroupIndex"+index]={"screen": (props) => <GroupOverview {...props} group={group}/>};
          // });
          
          // groupOverviewStack = DrawerNavigator({
          //   GroupIndex0: {
          //     screen: (props) => <GroupHome {...props} group={groups[0]}/>
          //   }
          //   // ...screenMapping,
          // });

          // console.log("hello from home");
          // console.log(groupOverviewStack);
        }
        dataReady = true;
    }
  }
  return {
    dataReady: dataReady,
    groups:groups,
    groupOverviewStack:groupOverviewStack,
    currentUser: user,
  };
})(Home);