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
import Button from 'WeTime/src/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome'
import styles from './styles';

export default class SidebarMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fakeContact: [],
      SelectedFakeContactList: []
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  renderGroups(){
    return this.props.groups.map((group, index) => {
        return(
            <Text key={group._id}>
                {group.groupName}
            </Text>
        )
      });
  }

  render() {
    if(this.props.groups && this.props.groups.length > 0){
        return(
            <View style={styles.container}>
                <Text>
                    MyTeams
                </Text>
                {this.renderGroups()}
                <Button text="Create a Team" onPress={this.props.createNewClick}/>
            </View>
        );
    }
  };
};

SidebarMenu.propTypes = {
    createNewClick: PropTypes.func.isRequired, 
    currentUser: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
};