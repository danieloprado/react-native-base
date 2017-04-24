import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  buttonFacebook: {
    backgroundColor: '#3b5998'
  },
  buttonGoogle: {
    backgroundColor: '#de5245'
  },
  cardItemMultiline: {
    width: Dimensions.get('screen').width - 120,
  },
  centerPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  alignRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }
});