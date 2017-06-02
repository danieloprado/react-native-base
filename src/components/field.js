import { Body, Icon, Input, Item, Left, ListItem, Picker, Text, View } from 'native-base';

import BaseComponent from './base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import dateFormatter from '../formatters/date';
import theme from '../theme';
import { variables } from '../theme';

const keyboardTypes = {
  'text': 'default',
  'email': 'email-address',
  'number': 'numeric'
};

export default class Field extends BaseComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    next: PropTypes.func,
    icon: PropTypes.string,
    type: PropTypes.oneOf(['text', 'email', 'dropdown', 'dialog', 'date', 'number']),
    options: PropTypes.any,
    model: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object,
    onSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { showDatePicker: false };
  }

  focus() {
    if (this.props.type === 'date') {
      this.setState({ showDatePicker: true });
      return;
    }

    if (this.input) {
      this.input._root.focus();
      return;
    }
  }

  next() {
    if (this.props.onSubmit) {
      this.props.onSubmit();
      return;
    }

    this.props.next && this.props.next().focus();
  }

  onChange(value) {
    this.props.onChange(this.props.field, value);

    if (this.props.type === 'date' || this.props.type === 'dropdown') {
      this.next();
    }
  }

  render() {
    const { showDatePicker } = this.state;
    const { label, model, errors, field, type, options, icon, next } = this.props;
    const error = (errors || {})[field] || [];
    const hasError = error.length > 0;

    return (
      <ListItem style={StyleSheet.flatten(styles.container)}>
        {icon &&
          <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
            {icon !== 'empty' && <Icon name={icon} style={StyleSheet.flatten(theme.listIcon)} />}
          </Left>
        }
        <Body>
          <View style={StyleSheet.flatten(styles.body)}>
            <Text note style={StyleSheet.flatten(hasError ? styles.errorLabel : null)}>{label}</Text>
            {type === 'dropdown' || type === 'dialog' ?
              <View style={StyleSheet.flatten(styles.picker)}>
                <Picker
                  iosHeader={label}
                  mode={type}
                  prompt={label}
                  ref={p => this.picker = p}
                  selectedValue={model[field]}
                  onValueChange={value => this.onChange(value)}>
                  {options.map(option =>
                    <Item key={option.value} label={option.display} value={option.value} />
                  )}
                </Picker>
              </View>
              : type === 'date' ?
                <View onTouchStart={() => this.setState({ showDatePicker: true })}>
                  <Item style={StyleSheet.flatten(styles.item)} error={hasError}>
                    <Input
                      disabled
                      value={model[field] ? dateFormatter.format(model[field], 'DD [de] MMMM [de] YYYY') : null}
                      style={StyleSheet.flatten(styles.input)}
                    />
                    {hasError && <Icon name='close-circle' />}
                  </Item>
                  <DateTimePicker
                    date={model[field]}
                    isVisible={showDatePicker}
                    onConfirm={value => this.setState({ showDatePicker: false }) && this.onChange(value)}
                    onCancel={() => this.setState({ showDatePicker: false })}
                  />
                </View>
                :
                <Item style={StyleSheet.flatten(styles.item)} error={hasError}>
                  <Input
                    ref={i => this.input = i}
                    value={(model[field] || '').toString()}
                    onChangeText={value => this.onChange(value)}
                    keyboardType={keyboardTypes[type] || keyboardTypes.text}
                    style={StyleSheet.flatten(styles.input)}
                    returnKeyType={next ? 'next' : 'default'}
                    onSubmitEditing={() => this.next()}
                  />
                  {hasError && <Icon name='close-circle' />}
                </Item>
            }
            <Text note style={StyleSheet.flatten(styles.errorMessage)}>{error[0]}</Text>
          </View>
        </Body>
      </ListItem>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingBottom: 5
  },
  body: {
    marginLeft: 12
  },
  input: {
    height: 40,
    lineHeight: 20,
    paddingLeft: 0
  },
  picker: {
    borderWidth: variables.borderWidth * 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: variables.inputBorderColor,
  },
  errorLabel: {
    opacity: 0.8,
    color: variables.inputErrorBorderColor
  },
  errorMessage: {
    color: variables.inputErrorBorderColor
  }
});