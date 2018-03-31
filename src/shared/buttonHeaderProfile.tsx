import { Button, Icon } from 'native-base';
import React from 'react';

import { WithNavigation } from '../decorators/withNavigation';
import BaseComponent from './abstract/baseComponent';

@WithNavigation()
export default class ButtonHeaderProfile extends BaseComponent {
  public render(): JSX.Element {
    return (
      <Button transparent onPress={() => this.navigate('Profile')}>
        <Icon name='contact' />
      </Button>
    );
  }
}