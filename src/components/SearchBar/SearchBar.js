import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome'

class SearchBar extends Component {
  render(){
    return (
      <View style={styles.searchSection}>
        <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000"/>
        <TextInput
          ref="search"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          {...this.props}
        />
        <TouchableOpacity style={styles.searchIcon} 
          onPress={() => {
            this.refs['search'].clear()
            this.refs['search'].blur()
          }}>
          <IconFA
            name="remove"
            color="#000"
            size={15}
          />
        </TouchableOpacity>
      </View>
    );
  }
};

export default SearchBar;
