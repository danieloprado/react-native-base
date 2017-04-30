import React from 'react';
import BaseComponent from './base';
import { variables } from '../theme';
import { StyleSheet } from 'react-native';
import { Item, Input, Text, View, Icon } from 'native-base';

export default class Field extends BaseComponent {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    model: React.PropTypes.any.isRequired,
    onChange: React.PropTypes.func.isRequired,
    error: React.PropTypes.array
  };

  render() {
    let { label, model, onChange, error } = this.props;
    error = error || [];
    let hasError = error.length > 0;

    return (
      <View style={StyleSheet.flatten(styles.container)}>
        <Text note style={StyleSheet.flatten(hasError ? styles.errorMessage: null)}>{label}</Text>
        <Item style={StyleSheet.flatten(styles.item)} error={hasError}>
          <Input value={model} onChangeText={value => onChange(value)} style={StyleSheet.flatten(styles.input)}  />
          {hasError && 
            <Icon name='close-circle' />
          }
        </Item>
        <Text note style={StyleSheet.flatten(styles.errorMessage)}>{error[0]}</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10
  },
  item: {
    marginLeft: 0
  },
  input: {
    paddingLeft: 0,
    paddingRight: 0,
    height: 40,
    lineHeight: 20
  },
  errorMessage: {
    color: variables.inputErrorBorderColor
  }
});