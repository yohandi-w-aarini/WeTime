import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {name as appName} from 'WeTime/app.json';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import Meteor, { withTracker } from 'react-native-meteor';
import firebase from 'react-native-firebase';
import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';

import IconFA from 'react-native-vector-icons/FontAwesome'

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
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      locationPermission:undefined,
      locationLoading:false,
      error: null,
      initialPosition:undefined,
      lastPosition:undefined
    };
  }

  async componentDidMount(){
    await this.getLocationSafe();
  }

  componentWillUnmount(){
    if(this.watchID){
      navigator.geolocation.clearWatch(this.watchID);
    }
 }

  getLocation(){
    this.setState({ locationLoading:true });
    navigator.geolocation.getCurrentPosition(
      (position) => {
         const initialPosition = JSON.stringify(position);
         console.log("INITIAL POS");
         console.log(initialPosition);
         this.setState({ 
          initialPosition:initialPosition,
          locationPermission:true,
          locationLoading:false 
        });
      },
      (error) => {
        console.log(error.message);
        this.setState({
          locationLoading:false 
        });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
   );
    this.watchID = navigator.geolocation.watchPosition((position) => {
        const lastPosition = JSON.stringify(position);
        console.log("LAST POS");
        console.log(lastPosition);
        this.setState({ lastPosition });
    });
  }


  async getLocationSafe(){
    const permission = await this.checkLocationPermission();

    if(permission){
      this.getLocation();
    }else if(permission === false){
      await this.requestLocationPermission();
    }else{
      console.log("error with permission check");
      this.setState({ locationPermission:false })
    }
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': `${appName} Location Permission`,
          'message': `${appName} needs access to your location ` +
                     'to create a better and more convenient meetings with your peers',
          'buttonPositive': "OK"
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocation();
      } else {
        this.setState({ locationPermission:false });
      }
    } catch (error) {
      console.warn(error)
    }
  }

  async checkLocationPermission() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.warn(error)
      return undefined;
    }
  }

  render(){
    return(
        <View style={styles.container}>
          <Text style={styles.main}>
            Group home with drawer navigation here
          </Text>
          <Text style={styles.main}>
            Group name: {this.props.selectedGroup.groupName}
          </Text>
          <Button text="Logout" onPress={()=>{
            Meteor.logout();
          }}/>

          <Button text="test notification" onPress={()=>{
            var result = Meteor.call('send.push.notification');
            console.log(result);
          }}/>
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
      headerLeft: <IconFA
                    name="bars"
                    color="black"
                    size={35}
                    onPress={ () => {
                      screenProps.rootNavigation.openDrawer();} }
                  />
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
  componentWillReceiveProps(nextProps){
    if(nextProps.groups && nextProps.groups.length < 1){
      const resetAction = StackActions.reset({
        index: 0, 
        key: null,
        actions: [
            NavigationActions.navigate({ routeName: 'Home' })
        ],
      });
      nextProps.navigation.dispatch(resetAction);
    }
  }
  render() {
    if(this.props.dataReady && this.props.groups && this.props.groups.length > 0){
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
            });
            if(!selectedGroup){
              selectedGroup = groups[0];
            }
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