import { Body, Icon, Input, Item, Left, ListItem, Picker, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import dateFormatter from '../formatters/date';
import { theme, variables } from '../theme';
import BaseComponent from './base';

const keyboardTypes = {
  'text': 'default',
  'email': 'email-address',
  'number': 'numeric',
  'phone': 'phone-pad'
};

const masks = {
  'zipcode': {
    maxlength: 9,
    apply: value => value.replace(/^(\d{0,5})(\d{0,3}).*/, '$1-$2').replace(/-$/, ''),
    clean: value => value.replace(/\D/gi, '').substr(0, 8)
  },
  'phone': {
    maxlength: 15,
    apply: value => {
      if (!value) return;

      const regexp = value.length > 10 ?
        /^(\d{0,2})(\d{0,5})(\d{0,4}).*/ :
        /^(\d{0,2})(\d{0,4})(\d{0,4}).*/;

      const result = value.length > 2 ?
        '($1) $2-$3' : '($1$2$3';

      return value.replace(regexp, result).replace(/-$/, '');
    },
    clean: value => value.replace(/\D/gi, '').substr(0, 11)
  }
};

export default class Field extends BaseComponent {
  static propTypes = {
    label: PropTypes.string,
    next: PropTypes.func,
    icon: PropTypes.string,
    mask: PropTypes.oneOf(['zipcode', 'phone']),
    type: PropTypes.oneOf(['text', 'email', 'dropdown', 'dialog', 'date', 'datetime', 'number', 'password', 'phone']),
    options: PropTypes.any,
    model: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object,
    onSubmit: PropTypes.func,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { showDatePicker: false };
  }

  componentDidMount() {
    const model = this.props.model;
    if (!model) return;

    const value = this.maskValue(model[this.props.field] || '');
    this.setState({ value }, true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.showDatePicker && nextState.showDatePicker) {
      return false;
    }

    return true;
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
    value = this.cleanValue(value);

    this.setState({ value: this.maskValue(value) }, true);
    this.props.onChange(this.props.field, value);

    // if (['date', 'datetime', 'dropdown'].includes(this.props.type)) {
    //   this.next();
    // }
  }

  maskValue(value) {
    const mask = masks[this.props.mask];
    return mask ? mask.apply(value) : value;
  }

  cleanValue(value) {
    const mask = masks[this.props.mask];
    return mask ? mask.clean(value) : value;
  }

  render() {
    let { label, errors, field, type, options, icon, next, style } = this.props;
    const { showDatePicker, value } = this.state;

    const error = (errors || [])[field] || [];
    const hasError = error.length > 0;

    const mask = masks[this.props.mask];
    const maxlength = mask ? mask.maxlength : null;

    style = style || {};

    return (
      <ListItem style={styles.container}>
        {icon &&
          <Left style={theme.listIconWrapper}>
            {icon !== 'empty' && <Icon name={icon} style={theme.listIcon} />}
          </Left>
        }
        <Body>
          <View style={styles.body}>
            {!!label &&
              <Text note style={StyleSheet.flatten([style.label, hasError ? styles.errorLabel : null])}>{label}</Text>
            }
            {type === 'dropdown' || type === 'dialog' ?
              <View style={styles.picker}>
                <Picker
                  iosHeader={label}
                  mode={type}
                  prompt={label}
                  ref={p => this.picker = p}
                  selectedValue={value}
                  onValueChange={value => this.onChange(value)}>
                  {options.map(option =>
                    <Item key={option.value} label={option.display} value={option.value} />
                  )}
                </Picker>
              </View>
              : ['date', 'datetime'].includes(type) ?
                <View onTouchStart={() => this.setState({ showDatePicker: true })}>
                  <Item error={hasError}>
                    <Input
                      disabled
                      value={value ? dateFormatter.format(value, `DD/MMM/YYYY${type === 'datetime' ? ' [às] HH:mm' : ''}`) : null}
                      style={styles.input}
                    />
                    {hasError && <Icon name='close-circle' />}
                  </Item>
                  <DateTimePicker
                    {...this.props}
                    mode={type}
                    date={dateFormatter.parse(value || new Date())}
                    isVisible={showDatePicker}
                    titleIOS="Selecione uma data"
                    confirmTextIOS="Confirmar"
                    cancelTextIOS="Cancelar"
                    onConfirm={value => this.setState({ showDatePicker: false }) && this.onChange(value)}
                    onCancel={() => this.setState({ showDatePicker: false })}
                  />
                </View>
                :
                <Item style={StyleSheet.flatten([style.item, hasError ? { borderColor: variables.inputErrorBorderColor } : null])} error={hasError}>
                  <Input
                    placeholder={this.props.placeholder}
                    ref={i => this.input = i}
                    value={(value || '').toString()}
                    onChangeText={value => this.onChange(value)}
                    keyboardType={keyboardTypes[type] || keyboardTypes.text}
                    secureTextEntry={type === 'password' ? true : false}
                    style={styles.input}
                    returnKeyType={next ? 'next' : 'default'}
                    maxLength={maxlength}
                    onSubmitEditing={() => this.next()}
                  />
                  {hasError && <Icon name='close-circle' />}
                </Item>
            }
            <Text note style={styles.errorMessage}>{error[0]}</Text>
          </View>
        </Body>
      </ListItem>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
    marginLeft: -10,
    marginRight: -20,
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