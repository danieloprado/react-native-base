import { Spinner, View } from 'native-base';
import React from 'react';
import { Modal, StyleSheet } from 'react-native';

import { variables } from '../theme';
import BaseComponent from './base';

export default class Loader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { refs: [] };
  }

  show(ref) {
    if (typeof ref !== 'string') {
      throw new Error('Loader.show needs a ref string value');
    }

    const { refs } = this.state;
    if (refs.includes(ref)) return;

    refs.push(ref);
    this.setState({ refs }, true);
  }

  hide(ref) {
    if (typeof ref !== 'string') {
      throw new Error('Loader.hide needs a ref string value');
    }

    const { refs } = this.state;
    const index = refs.indexOf(ref);
    if (index === -1) return;

    refs.splice(index, 1);
    this.setState({ show: false, counter: 0 }, true);
  }

  render() {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={!!this.state.refs.length}
        onRequestClose={() => { }}
      >
        <View style={StyleSheet.flatten(styles.container)}>
          <Spinner size='large' color={variables.accent} style={StyleSheet.flatten(styles.spinner)} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.5 }]
  }
});