import { Component } from 'react';
import { InteractionManager } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class BaseComponent extends Component {
  constructor(props) {
    super(props);

    this.params = {};
    if (this.props.navigation) {
      this.params = this.props.navigation.state.params;
    }
  }

  openDrawer() {
    this.navigate('DrawerOpen');
  }

  goBack() {
    this.props.navigation.goBack();
  }

  navigate(routeName, params, reset) {
    if (!reset) {
      this.props.navigation.navigate(routeName, params);
      return;
    }

    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName, params })]
    }));
  }

  setState(value, skip) {
    return new Promise(resolve => {

      if (skip) {
        return super.setState(value, () => resolve());
      }

      return InteractionManager.runAfterInteractions(() => {
        super.setState(value, () => resolve());
      });
    });
  }

  // showToast(text, type = null) {
  //   Toast.toastInstance = Toast.toastInstance || this.toastInstance;

  //   if (!Toast.toastInstance) {
  //     return alert(text);
  //   }

  //   InteractionManager.runAfterInteractions(() => {
  //     Toast.show({
  //       text,
  //       type,
  //       duration: 3000,
  //       position: 'bottom',
  //       buttonText: 'OK'
  //     });
  //   });
  // }
}