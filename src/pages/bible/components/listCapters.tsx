import { Button, Spinner, Text, View } from 'native-base';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { IBibleCapter } from '../../../interfaces/bible';
import { toastError } from '../../../providers/toast';
import bibleDatabase from '../../../services/database/bible';
import BaseComponent from '../../../shared/abstract/baseComponent';

interface IState {
  capters: IBibleCapter[];
}

interface IProps {
  bookId: number;
  onChange: (capter: IBibleCapter) => void;
}

export default class BibleListCapters extends BaseComponent<IState, IProps> {
  constructor(props: any) {
    super(props);

    this.state = { capters: null };
  }

  public componentDidMount(): void {
    this.loadCapters(this.props.bookId);
  }

  public componentWillReceiveProps(nextProps: Readonly<IProps>): void {
    this.loadCapters(nextProps.bookId);
  }

  public async loadCapters(bookId: number): Promise<void> {
    this.setState({ capters: null });

    bibleDatabase.listCapters(bookId)
      .bindComponent(this)
      .logError()
      .subscribe(capters => {
        this.setState({ capters });
      }, err => toastError(err));
  }

  public render(): JSX.Element {
    const { capters } = this.state;
    const { onChange } = this.props;

    if (!capters) {
      return (
        <View>
          <Spinner />
        </View>
      );
    }

    return (
      <ScrollView>
        <View style={styles.row}>
          {capters.map(capter =>
            <View key={capter.id} style={styles.col}>
              <Button block transparent onPress={() => onChange(capter)}>
                <Text style={styles.buttonText}>{capter.id}</Text>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 15
  },
  col: {
    width: 80,
    margin: 5
  },
  buttonText: {
    color: 'black',
    opacity: 0.8,
    fontSize: 18
  }
});