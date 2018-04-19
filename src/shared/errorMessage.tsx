import * as React from 'react';

import { EmptyMessage } from './emptyMessage';

interface IProps {
  error?: Error;
}

export class ErrorMessage extends React.PureComponent<IProps> {
  public render(): JSX.Element {
    const { error } = this.props;
    let icon, message;

    switch ((error || { message: '' }).message) {
      case 'no-internet':
      case 'NETWORK_ERROR':
        icon = 'ios-wifi';
        message = 'Sem conexão com a internet';
        break;
      case 'api-error':
        icon = 'thunderstorm';
        message = 'Não conseguimos se comunicar com o servidor';
        break;
      default:
        icon = 'bug';
        message = 'Algo deu errado...';
    }

    return <EmptyMessage icon={icon} message={message} />;
  }
}
