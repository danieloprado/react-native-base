import { Alert } from 'react-native';
import { Observable } from 'rxjs';

export default function alert(title, message, okText = 'OK') {
  return Observable.of(true).switchMap(() => {
    const promise = new Promise(resolve => {
      Alert.alert(title, message, [
        { text: okText, onPress: () => resolve(true) }
      ], { onDismiss: () => resolve(false) });
    });

    return Observable.fromPromise(promise);
  });
}