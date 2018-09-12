import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './styles';

const NoInternet = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.main}>
        No Internet
      </Text>
      <ActivityIndicator
        animating
        size={props.size}
        {...props}
      />
    </View>
  );
};

NoInternet.propTypes = {
  size: PropTypes.string,
};

NoInternet.defaultProps = {
  size: 'large',
};

export default NoInternet;
