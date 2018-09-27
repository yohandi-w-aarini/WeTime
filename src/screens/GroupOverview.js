import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
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
    const menu = <SidebarMenu 
          groups={this.props.groups} 
          currentUser={this.props.currentUser}
          selectedGroup={this.props.selectedGroup}
          createNewClick={() => this.props.navigation.navigate('CreateGroup', {navigation:this.props.navigation})}/>;
    return(
      <SideMenu menu={menu}>
        <View style={styles.container}>
          <Text style={styles.main}>
            Group home with drawer navigation here
          </Text>
          <Text style={styles.main}>
            Group name: {this.props.selectedGroup.groupName}
          </Text>
        </View>
      </SideMenu>
    );
  }
};

GroupOverview.propTypes = {
  selectedGroup: PropTypes.object,
  currentUser: PropTypes.object,
  groups: PropTypes.array,
};

var groupOverviewContainer = withTracker((props) => {
  var user;
  var dataReady = false;
  var groups = [];
  var group;

  if(props.groups){
    groups = props.groups
  }else{
    groups = props.navigation.getParam('groups', []);
  }

  if(props.selectedGroup){
    group = props.selectedGroup
  }else{
    group = props.navigation.getParam('selectedGroup', undefined);
  }

  if(props.currentUser){
    user = props.currentUser
  }else{
    user = props.navigation.getParam('currentUser', undefined);
  }

  return {
    dataReady: dataReady,
    groups:groups,
    selectedGroup:group,
    currentUser: user,
  };
})(GroupOverview);

groupOverviewContainer.navigationOptions = ({ navigation }) => {
  console.log("hi from navigation options in group overview");
  console.log(navigation);
  var param = navigation.getParam('selectedGroup', undefined);
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

export default groupOverviewContainer;