import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { DrawerActions, StackActions } from 'react-navigation';
import Button from 'WeTime/src/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome'
import styles from './styles';
import { colors } from 'WeTime/src/config/styles';

import DrawerEvents from 'WeTime/src/components/SidebarMenu/DrawerEvent';

class SidebarMenu extends Component {
  constructor(props) {
    super(props)

    this.subscribeToDrawerEvents = this.subscribeToDrawerEvents.bind(this);

    // Subsribe to drawer events
    DrawerEvents.subscribe(this.subscribeToDrawerEvents);
  }

  
    subscribeToDrawerEvents(event) {
        if (event === 'DRAWER_CLOSED' && this.route) {
            this.navigateAfterDrawerGetsClosed();

            this.route = null;
        }

        // if (event === 'CLOSE_DRAWER_NOW' && this.route) {
        //     this.props.navigation.dispatch(DrawerActions.closeDrawer());
        // }
    }

    navigateAfterDrawerGetsClosed() {
        const route = this.route;

        setTimeout(() => this.props.navigation.navigate(route), 0);
    }

    navigate(route) {
        // this.route = route;
        // this.props.navigation.dispatch(DrawerActions.closeDrawer());
        // const pushAction = StackActions.push({
        //     routeName: route,
        //   });
        // this.props.navigation.dispatch(pushAction);
        this.props.navigation.navigate('CreateGroup',{closeDrawer:true});
    }


  renderGroups(){
    if(this.props.groups && this.props.groups.length > 0){
        return this.props.groups.map((group, index) => {
            if(this.props.selectedGroupId && group._id == this.props.selectedGroupId){
                return(
                    <Text key={group._id} style={{
                        fontSize: 20,
                        textAlign: 'center',
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderWidth: 0.5,
                        borderColor: '#a1a4aa',
                        backgroundColor:colors.background,
                        alignSelf: 'stretch',
                      }}>
                        {group.groupName} --*
                    </Text>
                );
            }
            return(
                <Text key={group._id} style={{
                    fontSize: 20,
                    textAlign: 'center',
                    paddingTop: 5,
                    paddingBottom: 5,
                    borderWidth: 0.5,
                    borderColor: '#a1a4aa',
                    alignSelf: 'stretch',
                  }}>
                    {group.groupName}
                </Text>
            );
          });
    }else{
        return(
            <Text>
                You don't currently have any team
            </Text>
        );
    }
    
  }

  render() {
    if(this.props.dataReady){
        return(
            <View style={styles.container}>
                <Text>
                    MyTeams
                </Text>
                <ScrollView style={{alignSelf: 'stretch'}}>
                {this.renderGroups()}
                <Button text="Create a Team" onPress={this.navigate.bind(this,'CreateGroup')}/>
                </ScrollView>
            </View>
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
  };
};

SidebarMenu.propTypes = {
    selectedGroupId: PropTypes.string,
};

export default withTracker((props) => {
    var user = Meteor.user();
    var dataReady = false;
    var groups = [];
    var selectedGroupId;

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
            dataReady = true;
        }
    }
    return {
        dataReady: dataReady,
        groups:groups,
        selectedGroupId:selectedGroupId,
        currentUser: user,
    };
  })(SidebarMenu);