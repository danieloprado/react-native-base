import { Button, Icon, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';

import { variables } from '../theme';

export default function emptyMessage(props) {
  return (
    <View padder style={styles.container}>
      <Icon name={props.icon} style={styles.icon} />
      <Text style={styles.message}>{props.message}</Text>
      {!!props.button &&
        <Button accent block style={styles.button} onPress={() => props.onPress()}>
          <Text>{props.button}</Text>
        </Button>
      }
    </View>
  );
}

emptyMessage.propTypes = {
  icon: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  button: PropTypes.string,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginTop: 100,
    fontSize: 100,
    color: variables.darkGray
  },
  message: {
    marginTop: 5,
    fontSize: 18,
    opacity: 0.5
  },
  button: {
    marginTop: 20
  },
});