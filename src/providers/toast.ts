import { Toast } from 'native-base';

import { errorMessageFormatter } from '../formatters/errorMessage';
import { InteractionManager } from './interactionManager';

type typeToast = 'danger' | 'success' | 'warning';

export function toast(text: string, duration: number = 5000, type: typeToast = null): void {
  // if (duration === 0) {
  duration = 1000 * 60 * 60 * 60;
  // }

  InteractionManager.runAfterInteractions(() => {
    Toast.show({
      text,
      position: 'bottom',
      buttonText: 'OK',
      duration,
      type
    });
  });
}

export function toastError(err: any): void {
  toast(errorMessageFormatter(err), 0, 'danger');
}