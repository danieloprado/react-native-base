import { Body, Icon, Input, Item, Left, ListItem, Picker, Text, View } from 'native-base';

import BaseComponent from './base';
import DateTimePicker from 'react-native-modal-datetime-picker';
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
    label: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string,
    type: React.PropTypes.oneOf(['text', 'email', 'dropdown', 'dialog', 'date', 'number']),
    options: React.PropTypes.any,
    model: React.PropTypes.object.isRequired,
    field: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { showDatePicker: false };
  }

  render() {
    const { showDatePicker } = this.state;
    const { label, model, onChange, errors, field, type, options, icon } = this.props;
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
          <View>
          <Text note style={StyleSheet.flatten(hasError ? styles.errorMessage: null)}>{label}</Text>
          { type === 'dropdown' || type === 'dialog' ?
            <View style={StyleSheet.flatten(styles.picker)}>
              <Picker
                iosHeader={label}
                mode={type}
                prompt={label}
                selectedValue={model[field]}
                onValueChange={value => onChange(field, value)}>
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
                  style={StyleSheet.flatten(styles.input)} />
                { hasError && <Icon name='close-circle' /> }
              </Item>
              <DateTimePicker
                  date={model[field]}
                  isVisible={showDatePicker}
                  onConfirm={value => this.setState({ showDatePicker: false }) && onChange(field, value)}
                  onCancel={() => this.setState({ showDatePicker: false })}
                />
            </View>
          :
            <Item style={StyleSheet.flatten(styles.item)} error={hasError}>
              <Input 
                value={model[field]} 
                onChangeText={value => onChange(field, value)}
                keyboardType={keyboardTypes[type] || keyboardTypes.text}
                style={StyleSheet.flatten(styles.input)} />
              { hasError && <Icon name='close-circle' /> }
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
  item: {
    marginLeft: 0
  },
  input: {
    height: 40,
    lineHeight: 20
  },
  picker: {
    borderWidth: variables.borderWidth * 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: variables.inputBorderColor,
  },
  errorMessage: {
    color: variables.inputErrorBorderColor
  }
});