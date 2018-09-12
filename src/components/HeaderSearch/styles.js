import { StyleSheet } from 'react-native';
import { colors } from 'WeTime/src/config/styles';

export default StyleSheet.create({
  mainTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.headerText,
    fontWeight: '400',
  },
  subTitle: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.headerText,
    fontWeight: '200',
    fontStyle: 'italic',
  },
});
