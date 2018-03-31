import { Body, ListItem, Radio, Right, Spinner, Text } from 'native-base';
import React from 'react';
import { FlatList, FlatListStatic, View } from 'react-native';

import { IBibleBook } from '../../../interfaces/bible';
import { toastError } from '../../../providers/toast';
import bibleDatabase from '../../../services/database/bible';
import BaseComponent from '../../../shared/abstract/baseComponent';
import { classes } from '../../../theme';

interface IState {
  books: IBibleBook[];
}

interface IProps {
  value: number;
  onChange: (book: IBibleBook) => void;
}

export default class BibleListBooks extends BaseComponent<IState, IProps> {
  private flatListRef: FlatListStatic<IBibleBook>;

  constructor(props: any) {
    super(props);
    this.state = { books: null };
  }

  public componentDidMount(): void {
    bibleDatabase.listBooks()
      .logError()
      .bindComponent(this)
      .subscribe(async books => {
        await this.setState({ books });
        setTimeout(() => this.flatListRef.scrollToIndex({ index: this.props.value }), 500);
      }, err => toastError(err));
  }

  public render(): JSX.Element {
    const { books } = this.state;
    const { value, onChange } = this.props;

    if (!books) {
      return (
        <View>
          <Spinner />
        </View>
      );
    }

    return (
      <FlatList
        ref={(ref: any) => this.flatListRef = ref}
        keyExtractor={book => book.id.toString()}
        extraData={value}
        data={books}
        getItemLayout={(data, index) => (
          { length: 43, offset: 43 * index, index }
        )}
        renderItem={({ item }: { item: IBibleBook }) =>
          <ListItem
            selected={value === item.id}
            button
            style={classes.listItem}
            onPress={() => onChange(item)}>
            <Body>
              <Text>{item.name}</Text>
            </Body>
            <Right>
              <Radio selected={value === item.id} />
            </Right>
          </ListItem>
        } />
    );
  }
}