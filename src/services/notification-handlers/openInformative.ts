import { NavigationActions } from 'react-navigation';

import { INotificationHandler } from '../interfaces/notification';

export const handle: INotificationHandler<{ id: string }> = async (dispatch, info, appStarted) => {
  const id = Number(info.data.id);

  if (!appStarted) {
    dispatch({
      type: 'Navigation/NAVIGATE', routeName: 'InformativeDetails',
      params: { id }
    });
    return;
  }

  dispatch(NavigationActions.reset({
    index: 1,
    key: null,
    actions: [
      NavigationActions.navigate({ routeName: 'Home' }),
      NavigationActions.navigate({ routeName: 'InformativeDetails', params: { id } })
    ]
  }));
};