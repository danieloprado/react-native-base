import { Toast } from 'native-base';

export default function show(text, duration = 5000) {
  Toast.show({
    text,
    position: 'bottom',
    buttonText: 'Ok',
    duration
  });
}