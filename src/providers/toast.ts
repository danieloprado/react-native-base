import { Toast } from 'native-base';

type typeToast = 'danger' | 'success' | 'warning';

export function toast(text: string, duration: number = 5000, type: typeToast = null): void {
  // if (Platform.OS === 'android') {
  //   ToastAndroid.showWithGravity(text, duration < 5000 ? ToastAndroid.SHORT : ToastAndroid.LONG, ToastAndroid.BOTTOM);
  //   return;
  // }

  if (duration === 0) {
    duration = 1000 * 60;
  }

  Toast.show({
    text,
    position: 'bottom',
    buttonText: 'Ok',
    duration,
    type
  });
}