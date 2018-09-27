import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
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
    this.state = {
      selectedGroup:undefined,
      selectedGroupIndex:-1,
    };
  }

  componentDidMount(){
    this.selectGroup(this.props.groups);
  }

  componentWillReceiveProps(nextProps) {
    this.selectGroup(nextProps.groups);
  }

  selectGroup(groups){
    var selectedGroupIndex = 0;
    if(groups && groups.length > 0){
      if(selectedGroupIndex != this.state.selectedGroupIndex){
        var selectedGroup = groups[selectedGroupIndex];
        this.setState({
          selectedGroup:groups[selectedGroupIndex],
          selectedGroupIndex:selectedGroupIndex
        })
        this.props.navigation.setParams({headerParam: selectedGroup.groupName});
      }
    }else{
      this.setState({
        selectedGroup:undefined,
        selectedGroupIndex:-1
      })
    }
  }

  render(){
    if(this.props.dataReady){
      if(this.props.groups.length > 0 && this.state.selectedGroup){
        //show group home screen
        const menu = <SidebarMenu 
          groups={this.props.groups} 
          currentUser={this.props.currentUser} 
          selectedGroupIndex={this.state.selectedGroupIndex} 
          createNewClick={() => this.props.navigation.navigate('CreateGroup', {navigation:this.props.navigation})}/>;
        return(
          <SideMenu menu={menu}>
            <GroupOverview currentUser={this.props.currentUser} groups={this.props.groups} selectedGroup={this.state.selectedGroup}/>
          </SideMenu>
        );
      }else if(this.props.groups.length < 1){  
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

var homeContainer = withTracker((props) => {
  var user = Meteor.user();
  var dataReady = false;
  var groups = [];

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
        dataReady = true;
    }
  }
  return {
    dataReady: dataReady,
    groups:groups,
    currentUser: user,
  };
})(Home);


homeContainer.navigationOptions = ({ navigation }) => {
  var param = navigation.getParam('headerParam', false);
  console.log(param);
  if(param){
    return {
      title: navigation.getParam('headerParam', ''),
    };
  }else{
    return{
      header: null,
    }
  }
  
};

export default homeContainer;