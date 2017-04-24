import { Component } from 'react';
import { InteractionManager } from 'react-native';

export default class BaseComponent extends Component {
  constructor(props) {
    super(props);

    if (this.props.navigation) {
      this.params = this.props.navigation.state.params;
    }
  }

  openDrawer() {
    this.navigate('DrawerOpen');
  }

  goBack() {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.goBack();
    });
  }

  navigate(url, params) {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate(url, params);
    });
  }

  setState(value) {
    InteractionManager.runAfterInteractions(() => super.setState(value));
  }
}