import { Modal, StyleSheet } from 'react-native';
import { Spinner, View } from 'native-base';

import BaseComponent from './base';
import { Observable } from 'rxjs';
import React from 'react';
import { variables } from '../theme';

export default class Loader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  fromObservable(stream$) {
    return Observable.create(observer => {
      this.show();

      stream$.finally(() => {
        this.hide();
      }).subscribe({
        next: data => observer.next(data),
        error: error => observer.error(error),
        complete: () => observer.complete()
      });
    });
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false });
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
         <Spinner size={60} color={variables.accent} style={StyleSheet.flatten(styles.spinner)} />
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
    alignItems: 'center'
  }
});