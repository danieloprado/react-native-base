import { Body, Icon, Left, ListItem, Text, View } from 'native-base';
import * as propTypes from 'prop-types';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { theme, variables } from '../../theme';
import { BaseComponent } from './../base';
import { FieldCheckbox } from './checkbox';
import { FieldDatepicker } from './datetime';
import { FieldPicker } from './picker';
import { FieldText } from './text';

interface IProps {
  label?: string;
  placeholder?: string;
  next?: () => any;
  icon?: string;
  type: 'text'
  | 'email'
  | 'dropdown'
  | 'dialog'
  | 'date'
  | 'datetime'
  | 'number'
  | 'password'
  | 'phone'
  | 'zipcode'
  | 'document'
  | 'boolean';
  options?: { value: string, display: string }[];
  model: any;
  field: string;
  onChange: Function;
  errors?: Validator.ErrorMessages;
  onSubmit?: Function;
  style?: Object;
  [key: string]: any;
}

export class Field extends BaseComponent<any, IProps> {
  public static propTypes: any = {
    label: propTypes.string,
    next: propTypes.func,
    icon: propTypes.string,
    type: propTypes.oneOf([
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
      'boolean'
    ]),
    options: propTypes.any,
    model: propTypes.object.isRequired,
    field: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    errors: propTypes.object,
    onSubmit: propTypes.func,
    style: propTypes.object
  };

  constructor(props: any) {
    super(props);

    const model = this.props.model;
    const value = model[this.props.field];
    this.state = { value };
  }

  public onChange(value: any): void {
    this.setState({ value }, true);
    this.props.onChange(this.props.field, value);
  }

  public focus(): void {
    if (!this.refs.field || !(this.refs.field as Field).focus) return;
    (this.refs.field as Field).focus();
  }

  public next(): void {
    if (this.props.onSubmit) {
      this.props.onSubmit();
      return;
    }

    this.props.next && this.props.next().focus();
  }

  public render(): JSX.Element {
    let { label, errors, field, type, icon } = this.props;
    const { value } = this.state;

    const error: any = (errors || {})[field] || [];
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
        content = <FieldPicker {...props as any} />;
        break;
      case 'date':
      case 'datetime':
        content = <FieldDatepicker ref='field' {...props as any} />;
        break;
      default:
        content = <FieldText ref='field' {...props as any} />;
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