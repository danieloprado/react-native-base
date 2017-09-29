import { ActionSheet, Button, Icon } from 'native-base';
import PropTypes from 'prop-types';
import React from 'react';
import { findNodeHandle, Platform, UIManager } from 'react-native';

import services from '../services';

export default class PopupMenu extends React.Component {
  static propTypes = {
    actions: PropTypes.array.isRequired
  };

  constructor() {
    super();
    this.logService = services.get('logService');
  }

  showMenu = () => {
    const { actions } = this.props;

    if (Platform.OS === 'ios') {
      ActionSheet.show({
        options: [...actions, { display: 'Cancelar' }].map(a => a.display),
        cancelButtonIndex: actions.length,
        title: 'Selecione'
      }, buttonIndex => {
        if (!actions[buttonIndex]) return;
        actions[buttonIndex].onPress();
      });
      return;
    }

    UIManager.showPopupMenu(
      findNodeHandle(this.refs.menu),
      actions.map(a => a.display),
      err => this.logService(err),
      (event, buttonIndex) => {
        if (event === 'itemSelected') {
          actions[buttonIndex].onPress();
        }
      },
    );
  };

  render() {
    const props = this.props;
    delete props.onPress;

    return (
      <Button {...props} onPress={() => this.showMenu()} ref="menu">
        <Icon name="more" />
      </Button>
    );
  }
}