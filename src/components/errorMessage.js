import React from 'react';

import EmptyMessage from './emptyMessage';


export default function errorMessage() {
  return (
    <EmptyMessage
      icon="sad"
      message="Um erro inexperado aconteceu..."
    />
  );
}
