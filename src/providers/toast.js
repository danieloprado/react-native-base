import { Toast } from 'native-base';
import { Platform, ToastAndroid } from 'react-native';

export default function toast(text, duration = 5000) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(text, duration < 5000 ? ToastAndroid.SHORT : ToastAndroid.LONG, ToastAndroid.BOTTOM);
    return;
  }

  Toast.show({
    text,
    position: 'bottom',
    buttonText: 'Ok',
    duration
  });
}

toast.genericError = function () {
  toast('Erro inesperado...', 10000);
};