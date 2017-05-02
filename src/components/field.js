import React from 'react';
import BaseComponent from './base';
import { variables } from '../theme';
import { StyleSheet } from 'react-native';
import { Item, Input, Text, View, Icon, Picker } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';

const keyboardTypes = {
  'text': 'default',
  'email': 'email-address'
};

export default class Field extends BaseComponent {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf(['text', 'email', 'multi', 'date']),
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
    const { label, model, onChange, errors, field, type, options } = this.props;
    const error = (errors || {})[field] || [];
    const hasError = error.length > 0;

    return (
      <View style={StyleSheet.flatten(styles.container)}>
        <Text note style={StyleSheet.flatten(hasError ? styles.errorMessage: null)}>{label}</Text>
        { type === 'multi' ?
          <View style={StyleSheet.flatten(styles.picker)}>
            <Picker
              iosHeader="Selecione"
              mode="dropdown"
              selectedValue={model[field]}
              onValueChange={value => onChange(field, value)}>
              {options.map(option => 
                <Item key={option.value} label={option.display} value={option.value} />
              )}
          </Picker>
          </View>
        : type === 'date' ?
          <View>

            <DateTimePicker
              isVisible={showDatePicker}
              onConfirm={value => onChange(field, value)}
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
    );
  }

}

const datePickerStyle = {
  dateIcon: {

  },
  dateInput: {
    borderWidth: variables.borderWidth * 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: variables.inputBorderColor
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10
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