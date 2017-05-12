import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';

import { DrawerView } from 'react-navigation';
import React from 'react';
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
    // height: 200
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  logo: {
    height: 80,
    width: 80,
    marginRight: 20
  },
  headerText: {
    fontSize: 20,
    color: platform.toolbarTextColor
  }
});