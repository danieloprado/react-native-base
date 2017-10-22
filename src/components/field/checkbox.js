import { Body, CheckBox, ListItem, Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function fieldCheckbox(props) {
  const { label, value, onChange } = props;

  return (
    <ListItem first last button onPress={() => onChange(!value)} style={styles.listItem} >
      <CheckBox checked={value} onPress={() => onChange(!value)} />
      <Body>
        <Text>{label}</Text>
      </Body>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: 20
  }
});