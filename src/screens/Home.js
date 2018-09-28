import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StackActions, NavigationActions  } from 'react-navigation';
import Meteor, { withTracker } from 'react-native-meteor';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GroupOverview from './GroupOverview';
import SideMenu from 'react-native-side-menu';
import SidebarMenu from 'WeTime/src/components/SidebarMenu';

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
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.selectGroup(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.selectGroup(nextProps);
  }

  // resetAction(props, selectedGroupIndex){
  //   return StackActions.reset({
  //     index: 0, 
  //     key: null,
  //     actions: [
  //         NavigationActions.navigate({ routeName: 'PrivateStackDrawer',params:{groups:props.groups, selectedGroup:props.groups[selectedGroupIndex],currentUser:props.currentUser}})
  //     ],
  //   });
  // }

  selectGroup(props){
    var selectedGroupIndex = 0;
    if(props.groups && props.groups.length > 0){
      // this.props.navigation.dispatch(this.resetAction(props, selectedGroupIndex));
      // this.props.navigation.replace('GroupHome', {}, NavigationActions.navigate({routeName:'GroupOverview', params:{groups:props.groups, selectedGroup:props.groups[selectedGroupIndex],currentUser:props.currentUser}}));
      this.props.navigation.replace('GroupHome', {groups:props.groups, selectedGroup:props.groups[selectedGroupIndex],currentUser:props.currentUser});
    }
  }

  render(){
    if(this.props.dataReady){
      if(this.props.groups.length < 1){  
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
      }else{
        return (
          <View style={styles.container}>
            <Text style={styles.main}>
              loading
            </Text>
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
          {"creatorId" : user._id}, 
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