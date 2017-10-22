import React from 'react';

import EmptyMessage from './emptyMessage';

export default function errorMessage(props) {
  let icon, message;

  switch ((props.error || {}).message) {
    case 'no-internet':
    case 'NETWORK_ERROR':
      icon = 'ios-wifi';
      message = 'Sem conexão com a internet';
      break;
    default:
      icon = 'bug';
      message = 'Algo deu errado...';
  }

  return (
    <EmptyMessage
      icon={icon}
      message={message}
    />
  );
}
