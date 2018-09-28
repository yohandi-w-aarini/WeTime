import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import Button from 'WeTime/src/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome'
import styles from './styles';

class SidebarMenu extends Component {
  constructor(props) {
    super(props)
  }

  renderGroups(){
    if(this.props.groups && this.props.groups.length > 0){
        return this.props.groups.map((group, index) => {
            return(
                <Text key={group._id}>
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
    return(
        <View style={styles.container}>
            <Text>
                MyTeams
            </Text>
            {this.renderGroups()}
            <Button text="Create a Team" onPress={()=>{
                this.props.navigation.navigate('CreateGroup');
                // this.props.navigation.navigate('NestedNavigator1', {}, NavigationActions.navigate({ routeName: 'screenB' }))
            }}/>
        </View>
    );
    
  };
};

SidebarMenu.propTypes = {
    createNewClick: PropTypes.func, 
    currentUser: PropTypes.object,
    groups: PropTypes.array,
};

export default withTracker((props) => {
    var user;
    var groups = [];
  
    if(props.groups){
      groups = props.groups
    }else{
      groups = props.navigation.getParam('groups', []);
    }
  
    if(props.currentUser){
      user = props.currentUser
    }else{
      user = props.navigation.getParam('currentUser', undefined);
    }
  
    return {
      groups:groups,
      currentUser: user,
    };
  })(SidebarMenu);