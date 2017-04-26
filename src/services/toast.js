import { ToastAndroid } from 'react-native';

export default function show(message, duraction = ToastAndroid.LONG) {
  ToastAndroid.showWithGravity(message, duraction, ToastAndroid.BOTTOM);
}