import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './styles';

const HeaderSearch = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>
      {props.groupName 
        ? props.groupName
        : "New Group"
      }
      </Text>
      <Text style={styles.subTitle}>
        Add participants
      </Text>
    </View>
  );
};

HeaderSearch.propTypes = {
  groupName: PropTypes.string,
};

export default HeaderSearch;
