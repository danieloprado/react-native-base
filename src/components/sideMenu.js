import React from 'react';
import { ScrollView, View, Image, StyleSheet, Dimensions } from 'react-native';
import { DrawerView } from 'react-navigation';
import { Text } from 'native-base';
import platform from '../../native-base-theme/variables/platform';

export default props => {

  return (
    <View style={StyleSheet.flatten(styles.container)}>
      <View style={StyleSheet.flatten(styles.header)}>
        <Image source={require('../images/logo.png')} style={StyleSheet.flatten(styles.logo)} />
        <Text style={StyleSheet.flatten(styles.headerText)}>ICB Sorocaba</Text>
      </View>
      <ScrollView>
        <DrawerView.Items {...props} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height
  },
  header: {
    backgroundColor: platform.toolbarDefaultBg,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200
  },
  logo: {
    height: 100,
    width: 100
  },
  headerText: {
    fontSize: 20,
    color: platform.toolbarTextColor,
    marginTop: 10
  }
});