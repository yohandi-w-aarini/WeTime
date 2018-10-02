import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Meteor, { withTracker } from 'react-native-meteor';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
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
  icon: {
    width: 24,
    height: 24,
  },
});

class GroupOverview extends Component {
  render(){
    return(
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
  selectedGroup: PropTypes.object,
};

var groupOverviewContainer = withTracker((props) => {
  return {
    selectedGroup:props.screenProps.selectedGroup,
  };
})(GroupOverview);

groupOverviewContainer.navigationOptions = ({ navigation, screenProps }) => {
  var param = navigation.getParam('selectedGroup', undefined);

  if(!param && screenProps && screenProps.selectedGroup){
    param = screenProps.selectedGroup;
  }

  if(param && param.groupName){
    return {
      title: param.groupName,
    };
  }else{
    return {
      title: "missingNo",
    };
  }
  
};

const GroupOverviewStack = createStackNavigator({
  GroupOverview: {
    screen: groupOverviewContainer,
  },
});

class GroupOverviewStackWrapper extends React.Component {
  constructor(props)  {
      super(props);
  }
  render() {
    if(this.props.dataReady){
      return (
        <GroupOverviewStack screenProps={{ rootNavigation: this.props.navigation, selectedGroup:this.props.selectedGroup }} />
      );
    }else{
      return (
        <View style={styles.container}>
            <Text>
                Loading
            </Text>
        </View>
      );
    }
  }
}

export default withTracker((props) => {
  var user = Meteor.user();
  var dataReady = false;
  var groups = [];
  var selectedGroupId;
  var selectedGroup;

  var nav;
  if(props.screenProps && props.screenProps.rootNavigation){
      nav = props.screenProps.rootNavigation;
  }else{
      nav = props.navigation;
  }

  if(props.selectedGroupId){
      selectedGroupId = props.selectedGroupId
  }else if(nav){
      selectedGroupId = nav.getParam('selectedGroupId', undefined);
  }

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
          if(selectedGroupId){
            selectedGroup = groups.find((gr)=>{
              return gr._id == selectedGroupId;
            })
          }
          dataReady = true;
      }
  }
  return {
      dataReady: dataReady,
      groups:groups,
      selectedGroup:selectedGroup,
      currentUser: user,
  };
})(GroupOverviewStackWrapper);