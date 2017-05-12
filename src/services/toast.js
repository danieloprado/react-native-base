import { Platform, ToastAndroid } from 'react-native';

export default function show(message, duraction = ToastAndroid.LONG) {
  if (Platform.OS === 'ios') {
    return alert(message);
  }

  ToastAndroid.show(message, duraction);
}