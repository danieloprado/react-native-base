import { withNavigation } from 'react-navigation';

export function WithNavigation(): any {
  return function <T>(target: T): T {
    return withNavigation(target as any) as any;
  };
}