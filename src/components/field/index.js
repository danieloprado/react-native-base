import { Body, Icon, Left, ListItem, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';

import { theme, variables } from '../../theme';
import BaseComponent from './../base';
import FieldCheckbox from './checkbox';
import FieldDatepicker from './datetime';
import FieldPicker from './picker';
import FieldText from './text';

export default class Field extends BaseComponent {
  static propTypes = {
    label: PropTypes.string,
    next: PropTypes.func,
    icon: PropTypes.string,
    type: PropTypes.oneOf([
      'text',
      'email',
      'dropdown',
      'dialog',
      'date',
      'datetime',
      'number',
      'password',
      'phone',
      'zipcode',
      'document',
      'boolean',
    ]),
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

    const value = model[this.props.field];
    this.setState({ value }, true);
  }

  onChange(value) {
    this.setState({ value }, true);
    this.props.onChange(this.props.field, value);
  }

  focus() {
    if (!this.refs.field || !this.refs.field.focus) return;
    this.refs.field.focus();
  }

  next() {
    if (this.props.onSubmit) {
      this.props.onSubmit();
      return;
    }

    this.props.next && this.props.next().focus();
  }

  render() {
    let { label, errors, field, type, icon } = this.props;
    const { value } = this.state;

    const error = (errors || {})[field] || [];
    const hasError = error.length > 0;

    const props = {
      ...this.props,
      value,
      hasError,
      next: this.next.bind(this),
      onChange: this.onChange.bind(this)
    };

    let content = null;

    switch (type) {
      case 'boolean':
        content = <FieldCheckbox {...props} />;
        break;
      case 'dropdown':
      case 'dialog':
        content = <FieldPicker {...props} />;
        break;
      case 'date':
      case 'datetime':
        content = <FieldDatepicker ref="field" {...props} />;
        break;
      default:
        content = <FieldText ref="field" {...props} />;
    }

    return (
      <ListItem style={styles.container}>
        {icon &&
          <Left style={theme.listIconWrapper}>
            {icon !== 'empty' && <Icon name={icon} style={theme.listIcon} />}
          </Left>
        }
        <Body>
          <View style={styles.body}>
            {!!label && type !== 'boolean' &&
              <Text note style={StyleSheet.flatten(hasError ? styles.errorLabel : null)}>{label}</Text>
            }
            {content}
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
  errorLabel: {
    opacity: 0.8,
    color: variables.inputErrorBorderColor
  },
  errorMessage: {
    color: variables.inputErrorBorderColor
  }
});