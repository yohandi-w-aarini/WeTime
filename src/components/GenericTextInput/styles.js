import { StyleSheet, Dimensions } from 'react-native';
import { colors } from 'WeTime/src/config/styles';

const window = Dimensions.get('window');
export default StyleSheet.create({
  input: {
    height: 40,
    borderRadius: 5,
    backgroundColor: colors.inputBackground,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.inputDivider,
  },
  inputWrapper: {
    backgroundColor: colors.inputBackground,
    width: window.width,
  },
});
