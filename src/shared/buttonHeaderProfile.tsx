import { Button, Icon } from 'native-base';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { WithNavigation } from '../decorators/withNavigation';
import { IUser } from '../interfaces/user';
import { toastError } from '../providers/toast';
import profileService from '../services/profile';
import BaseComponent from './abstract/baseComponent';

interface IState {
  user?: IUser;
}

@WithNavigation()
export default class ButtonHeaderProfile extends BaseComponent<IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {
    profileService.get()
      .logError()
      .bindComponent(this)
      .subscribe(user => {
        this.setState({ user });
      }, err => toastError(err));
  }

  public render(): JSX.Element {
    const { user } = this.state;

    if (!user || !user.avatar) {
      return (
        <Button transparent onPress={() => this.navigate('Profile')}>
          <Icon name='contact' style={styles.icon} />
        </Button>
      );
    }

    return (
      <Button transparent onPress={() => this.navigate('Profile')}>
        <Image style={styles.avatarImg} source={{ uri: user.avatar }} />
      </Button>
    );

  }
}

const styles = StyleSheet.create({
  avatarImg: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  icon: {
    fontSize: 28
  }
});