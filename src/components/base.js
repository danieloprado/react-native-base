import { Component } from 'react';
import { InteractionManager } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class BaseComponent extends Component {
  constructor(props) {
    super(props);

    this.subscriptions = [];
    this.params = {};
    this.unmonted = false;

    if (this.props.navigation) {
      this.params = this.props.navigation.state.params || {};
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.unmonted = true;
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
      key: null,
      actions: [NavigationActions.navigate({ routeName, params })]
    }));
  }

  navigateBuild(routes) {
    this.props.navigation.dispatch(NavigationActions.reset({
      index: routes.length - 1,
      key: null,
      actions: routes.map(route => NavigationActions.navigate(route))
    }));
  }

  setState(value, skip) {
    if (this.unmonted) return Promise.resolve();

    return new Promise(resolve => {
      if (skip) {
        return super.setState(value, () => resolve());
      }

      return InteractionManager.runAfterInteractions(() => {
        if (this.unmonted) return;
        super.setState(value, () => resolve());
      });
    });
  }

  updateModel(validator, key, value) {
    if (arguments.length === 2) {
      key = validator;
      validator = null;
    }

    let { model } = this.state;
    model[key] = value;

    if (!validator) {
      this.setState({ validation: {}, model }, true);
      return;
    }

    validator.validate(model)
      .logError()
      .bindComponent(this)
      .subscribe(({ model, errors }) => {
        this.setState({ validation: errors, model }, true);
      });
  }

}