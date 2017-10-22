import { Icon, Input, Item } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import { variables } from '../../theme';

const keyboardTypes = {
  'text': 'default',
  'email': 'email-address',
  'number': 'numeric',
  'phone': 'phone-pad',
  'zipcode': 'numeric',
  'document': 'default'
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
  },
  'document': {
    maxlength: 18,
    apply: value => {
      if (!value) return;

      const regexp = value.length > 11 ?
        /^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2}).*/ :
        /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2}).*/;

      const result = value.length > 11 ?
        '$1.$2.$3/$4-$5' : '$1.$2.$3-$4';

      return value
        .replace(regexp, result)
        .replace(/[-.\\]$/, '')
        .replace(/[-.\\]$/, '')
        .replace(/[-.\\]$/, '');
    },
    clean: value => value.replace(/\D/gi, '').substr(0, 18)
  }
};

export default class FieldText extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange(value) {
    value = this.cleanValue(value);
    this.props.onChange(value);
  }

  cleanValue(value) {
    const mask = masks[this.props.type];
    return mask ? mask.clean(value) : value;
  }

  focus() {
    if (this.input) {
      this.input._root.focus();
      return;
    }
  }

  render() {
    const { type, next, hasError, value, placeholder } = this.props;

    const mask = masks[this.props.type];
    const maxlength = mask ? mask.maxlength : null;
    const maskedValue = mask ? mask.apply(value || '') : value;

    return (
      <Item style={StyleSheet.flatten([hasError ? { borderColor: variables.inputErrorBorderColor } : null])} error={hasError}>
        <Input
          placeholder={placeholder}
          ref={i => this.input = i}
          value={(maskedValue || '').toString()}
          onChangeText={value => this.onChange(value)}
          keyboardType={keyboardTypes[type] || keyboardTypes.text}
          secureTextEntry={type === 'password' ? true : false}
          style={styles.input}
          returnKeyType={next ? 'next' : 'default'}
          maxLength={maxlength}
          onSubmitEditing={() => next()}
        />
        {hasError && <Icon name='close-circle' />}
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    lineHeight: 20,
    paddingLeft: 0
  }
});