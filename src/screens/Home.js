import React, { Component } from 'react';
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

  selectGroup(props){
    if(props.groups && props.groups.length > 0){
      var selectedGroupId;
      if(props.currentUser && props.currentUser.lastSelectedGroupId && 
        props.groups.find((g)=>{return g._id == props.currentUser.lastSelectedGroupId})){
          selectedGroupId = props.currentUser.lastSelectedGroupId;
      }else{
        selectedGroupId = props.groups[0]._id;
      }
      this.props.navigation.replace('GroupHome', {selectedGroupId:selectedGroupId});
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
            <Button text="Logout" onPress={()=>{
              Meteor.logout();
            }}/>
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
      //sort group descending on date last updated and date created
      groups =  Meteor.collection('group').find({},{sort: { updatedAt: -1, createdAt:-1 } });
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