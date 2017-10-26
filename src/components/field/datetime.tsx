import { Icon, Input, Item, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { dateFormatter } from '../../formatters/date';

interface IProps {
  type: 'datetime' | 'date' | 'time';
  value: any;
  hasError: boolean;
  onChange: (value: any) => void;
}

interface IState {
  showDatePicker: boolean;
}

export class FieldDatepicker extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = { showDatePicker: false };
  }

  public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>): boolean {
    if (this.state.showDatePicker && nextState.showDatePicker) {
      return false;
    }

    return true;
  }

  public focus(): void {
    this.show();
  }

  public show(): void {
    this.setState({ showDatePicker: true });
  }

  public hide(): void {
    this.setState({ showDatePicker: false });
  }

  public onChange(value: any): void {
    this.setState({ showDatePicker: false }, () => {
      this.props.onChange(value);
    });
  }

  public render(): JSX.Element {
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
          titleIOS='Selecione uma data'
          confirmTextIOS='Confirmar'
          cancelTextIOS='Cancelar'
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