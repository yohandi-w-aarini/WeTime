import React from 'react';
import PropTypes from 'prop-types';
import Meteor from 'react-native-meteor';
import { StyleSheet, Text, View } from 'react-native';
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

const HomeAuth = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.main}>
        Home auth
      </Text>
      <Button
        text="Logout"
        onPress={() => Meteor.logout()}
      />
    </View>
  );
};

HomeAuth.propTypes = {
  navigation: PropTypes.object,
};

export default HomeAuth;
