import { Component, ReactInstance } from 'react';
import { NavigationActions, NavigationNavigateActionPayload, NavigationScreenProp } from 'react-navigation';
import { Subscription } from 'rxjs';

import { InteractionManager } from '../../providers/interactionManager';

export default abstract class BaseComponent<S = any, P = any, R = any> extends Component<P, S> {
  public subscriptions: Subscription[];
  public params: any;
  public navigation?: NavigationScreenProp<any>;
  public refs: R & { [key: string]: ReactInstance };

  private unmonted: boolean;

  constructor(props: any) {
    super(props);

    this.subscriptions = [];
    this.params = {};
    this.unmonted = false;

    this.navigation = (this.props as any).navigation;

    if (this.navigation) {
      this.params = this.navigation.state.params || {};
    }
  }

  public componentWillUnmount(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.unmonted = true;
  }

  public setState<K extends keyof S>(f: (prevState: S, props: P) => Pick<S, K>, callback?: () => any): Promise<void>;
  public setState<K extends keyof S>(state: Pick<S, K>, skip: boolean): Promise<void>;
  public setState<K extends keyof S>(state: Pick<S, K>, skip?: any): Promise<void>;
  public setState(state: any, skip: any): Promise<void> {
    if (this.unmonted) return Promise.resolve();

    return new Promise(resolve => {
      if (skip) {
        return super.setState(state as any, () => resolve());
      }

      return InteractionManager.runAfterInteractions(() => {
        if (this.unmonted) return;
        super.setState(state as any, () => resolve());
      });
    });
  }

  protected navigateBack(): void {
    this.navigation.goBack(null);
  }

  protected navigate(routeName: string, reset?: boolean): void;
  protected navigate(routeName: string, params: any, reset?: boolean): void;
  protected navigate(routeName: string, resetOrParam?: any, forceReset?: any): void {
    let params, reset: boolean;

    if (typeof resetOrParam === 'boolean') {
      reset = resetOrParam;
      params = null;
    } else {
      reset = forceReset || false;
      params = resetOrParam;
    }

    if (!reset) {
      this.navigation.navigate(routeName, params);
      return;
    }

    this.navigation.dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({
        routeName,
        params,
        action: NavigationActions.navigate({ routeName, params })
      })]
    }));
  }

  protected navigateBuild(routes: NavigationNavigateActionPayload[]): void {
    this.navigation.dispatch(NavigationActions.reset({
      index: routes.length - 1,
      key: null,
      actions: routes.map(route => NavigationActions.navigate(route))
    }));
  }
}