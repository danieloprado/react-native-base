import { Icon, Input, Item, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import dateFormatter from '../../formatters/date';

export default class FieldPicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showDatePicker: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.showDatePicker && nextState.showDatePicker) {
      return false;
    }

    return true;
  }

  focus() {
    this.show();
  }

  show() {
    this.setState({ showDatePicker: true });
  }

  hide() {
    this.setState({ showDatePicker: false });
  }

  onChange(value) {
    this.setState({ showDatePicker: false }, () => {
      this.props.onChange(value);
    });
  }

  render() {
    const { showDatePicker } = this.state;
    const { type, value, hasError } = this.props;

    return (
      <View onTouchStart={() => this.show()}>
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
          onConfirm={value => this.onChange(value)}
          onCancel={() => this.hide()}
        />
      </View>
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