import { Alert } from 'react-native';
import { Observable } from 'rxjs';

import { errorMessageFormatter } from '../formatters/errorMessage';

export function alert(title: string, message: string, okText: string = 'OK'): Observable<boolean> {
  return Observable.of(true).switchMap(() => {
    const promise = new Promise<boolean>(resolve => {
      setTimeout(() => {
        Alert.alert(title, message, [
          { text: okText, onPress: () => resolve(true) }
        ], { onDismiss: () => resolve(false) });
      }, 500);
    });

    return Observable.fromPromise(promise);
  });
}

export function alertError(err: any): Observable<boolean> {
  return alert('Erro', errorMessageFormatter(err));
}