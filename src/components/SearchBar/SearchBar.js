import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome'

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.mounted = false;

    this.state = {
      isFocused:undefined,
    };
  }

  componentDidMount(){
    this.mounted = true;

    this.setState({
      isFocused: this.refs['search'] && this.refs['search'].isFocused()
    });
  }

  componentDidUpdate(){
    if(this.mounted){
      var focus = this.refs['search'] && this.refs['search'].isFocused();

      if(this.state.isFocused != focus){
        this.setState({
          isFocused: focus
        });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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
        {this.state.isFocused
        ?
        <TouchableOpacity style={styles.searchIcon} 
          onPress={() => {
            this.refs['search'].clear()
            this.refs['search'].blur()
            this.props.removeFilter(false);
          }}>
          <IconFA
            name="remove"
            color="#000"
            size={15}
          />
        </TouchableOpacity>
        :
        null
        }
        
      </View>
    );
  }
};

export default SearchBar;
