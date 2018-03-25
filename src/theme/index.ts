import variablesTheme from 'native-base/src/theme/variables/platform';
import { Dimensions, StyleSheet } from 'react-native';

const primary = '#263238';
const accent = '#86bd90';

export const theme: typeof variablesTheme & { primary: string, accent: string } = {
  ...Object.keys(variablesTheme).reduce((acc, key) => {
    let value = (variablesTheme as any)[key];

    const prop = Object.getOwnPropertyDescriptor(variablesTheme, key);
    if (prop.get) {
      Object.defineProperty(acc, key, prop);
      return acc;
    } else if (value === '#3F51B5') {
      value = primary;
    } else if (value === '#007aff') {
      value = accent;
    }

    acc[key] = value;
    return acc;
  }, {} as any),
  primary,
  accent,
  get btnPrimaryBg(): string {
    return accent;
  },
  topTabBarTextColor: variablesTheme.platform === 'ios' ? accent : 'white',
};

console.log(theme.statusBarColor);

export const classes = StyleSheet.create({
  buttonFacebook: {
    backgroundColor: '#3b5998'
  },
  buttonGoogle: {
    backgroundColor: '#de5245'
  },
  cardsContainer: {
    backgroundColor: '#f4f4f7'
  },
  cardsPadding: {
    padding: 8
  },
  fabPadding: {
    paddingBottom: 90
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
  emptyMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  textCenter: {
    textAlign: 'center'
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  alignRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  listItem: {
    marginLeft: 0
  },
  listIconWrapper: {
    maxWidth: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listIconWrapperSmall: {
    maxWidth: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listIcon: {
    width: 40,
    fontSize: 30,
    marginLeft: 10,
    textAlign: 'center'
  },
  iconLarge: {
    fontSize: 80
  }
});