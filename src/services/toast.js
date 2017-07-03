import { InteractionManager } from 'react-native';
import { Toast } from 'native-base';

export default function show(text, duration = 3000) {
  InteractionManager.runAfterInteractions(() => {
    Toast.show({
      text,
      position: 'bottom',
      buttonText: 'Ok',
      duration
    });
  });
}