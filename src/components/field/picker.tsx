import { Item, Picker, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { variables } from '../../theme';

interface IProps {
  label?: string;
  type: 'dropdown' | 'dialog';
  value: any;
  options?: { value: string, display: string }[];
  onChange: (value: any) => void;

}

export function FieldPicker(props: IProps): JSX.Element {
  const { label, type, value, options, onChange } = props;

  return (
    <View style={styles.picker}>
      <Picker
        iosHeader={label}
        mode={type}
        prompt={label}
        selectedValue={value}
        onValueChange={value => onChange(value)}>
        {options.map(option =>
          <Item key={option.value} label={option.display} value={option.value} />
        )}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    borderWidth: variables.borderWidth * 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: variables.inputBorderColor,
  },
});