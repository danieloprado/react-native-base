import { Button, Icon, Text, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '../theme';

interface IProps {
  icon: string;
  message: string;
  button?: string;
  onPress?: Function;
}

export class EmptyMessage extends React.PureComponent<IProps> {
  public render(): JSX.Element {
    const { icon, message, button, onPress } = this.props;

    return (
      <View padder style={styles.container}>
        <Icon name={icon} style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
        {!!button &&
          <Button accent block style={styles.button} onPress={() => onPress()}>
            <Text>{button}</Text>
          </Button>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginTop: 90,
    fontSize: 100,
    color: theme.darkGray
  },
  message: {
    marginTop: 5,
    fontSize: 18,
    opacity: 0.5,
    textAlign: 'center'
  },
  button: {
    marginTop: 20
  }
});