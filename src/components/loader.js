import { Spinner, View } from 'native-base';
import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import { Observable } from 'rxjs';

import { variables } from '../theme';
import BaseComponent from './base';

export default class Loader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  fromObservable(stream$) {
    return new Observable(observer => {
      this.show();

      const subscription = stream$.do(() => {
        this.hide();
      }).subscribe({
        next: data => observer.next(data),
        error: error => observer.error(error),
        complete: () => observer.complete()
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }

  show() {
    this.setState({ show: true }, true);
  }

  hide() {
    this.setState({ show: false }, true);
  }

  render() {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.state.show}
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