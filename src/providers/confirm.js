import { Alert } from 'react-native';
import { Observable } from 'rxjs';

export default function confirm(title, message, okText = 'OK', cancelText = 'Cancelar') {
  return Observable.of(true).switchMap(() => {
    const promise = new Promise(resolve => {
      Alert.alert(title, message, [
        { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
        { text: okText, onPress: () => resolve(true) }
      ], { onDismiss: () => resolve(false) });
    });

    return Observable.fromPromise(promise);
  });
}