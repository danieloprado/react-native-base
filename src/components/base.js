import { Component } from 'react';
import { InteractionManager } from 'react-native';
// import { Toast } from 'native-base';

export default class BaseComponent extends Component {
  constructor(props) {
    super(props);

    this.params = {};
    if (this.props.navigation) {
      this.params = this.props.navigation.state.params;
    }
  }

  // componentDidMount() {
  //   this.toastInstance = Toast.toastInstance;
  // }

  openDrawer() {
    this.navigate('DrawerOpen');
  }

  goBack() {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.goBack();
    });
  }

  navigate(url, params) {
    // InteractionManager.runAfterInteractions(() => {
    this.props.navigation.navigate(url, params);
    // });
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