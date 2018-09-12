import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './styles';

const ServerUnreachable = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.main}>
        Seems like we are having problem connecting you to our server.
      </Text>
      <ActivityIndicator
        animating
        size={props.size}
        {...props}
      />
    </View>
  );
};

ServerUnreachable.propTypes = {
  size: PropTypes.string,
};

ServerUnreachable.defaultProps = {
  size: 'large',
};

export default ServerUnreachable;
