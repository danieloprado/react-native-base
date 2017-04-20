import React from 'react';
import { StyleProvider, Container } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

export default class Wrapper extends React.Component {
  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          {this.props.children}
        </Container>    
      </StyleProvider>
    );
  }
}