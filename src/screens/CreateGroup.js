import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image } from 'react-native';
import Meteor from 'react-native-meteor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { colors } from 'WeTime/src/config/styles';
import Button from 'WeTime/src/components/Button';
import GenericTextInput, { InputWrapper } from 'WeTime/src/components/GenericTextInput';
import HeaderSearch from 'WeTime/src/components/HeaderSearch';

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  buttons: {
    flexDirection: 'row',
  },
  error: {
    height: 28,
    justifyContent: 'center',
    width: window.width,
    alignItems: 'center',
  },
  errorText: {
    color: colors.errorText,
    fontSize: 14,
  }
});

class CreateGroup extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      confirmPasswordVisible: false,
      error: null,
    };
  }

  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <HeaderSearch />,
  };

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleError = (error) => {
    if (this.mounted) {
      this.setState({ error });
    }
  }

  validInput = (overrideConfirm) => {
    const { email, password, confirmPassword, confirmPasswordVisible } = this.state;
    let valid = true;

    if (email.length === 0 || password.length === 0) {
      this.handleError('Email and password cannot be empty.');
      valid = false;
    }

    if (!overrideConfirm && confirmPasswordVisible && password !== confirmPassword) {
      this.handleError('Passwords do not match.');
      valid = false;
    }

    if (valid) {
      this.handleError(null);
    }

    return valid;
  }

  render() {
    return (
      <View style={styles.container}>
        <InputWrapper>
          <GenericTextInput
            placeholder="email address"
            onChangeText={(email) => this.setState({ email })}
          />
          <GenericTextInput
            placeholder="password"
            onChangeText={(password) => this.setState({ password })}
            secureTextEntry
            borderTop
          />
          {this.state.confirmPasswordVisible ?
            <GenericTextInput
              placeholder="confirm password"
              onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
              secureTextEntry
              borderTop
            />
          : null}
        </InputWrapper>

        <View style={styles.error}>
          <Text style={styles.errorText}>{this.state.error}</Text>
        </View>

        <View style={styles.buttons}>
          <Button text="Create Group" />
        </View>

        <KeyboardSpacer />
      </View>
    );
  }
}

export default CreateGroup;
