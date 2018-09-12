import React from 'react';
import PropTypes from 'prop-types';
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

const Home = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.main}>
        Home
      </Text>
      <Button text="Join a Team" onPress={() => props.navigation.navigate('SignIn', {navigation:props.navigation})} />
      <Button text="Create a Team"/>
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
