import { Body, ListItem, Radio, Right, Spinner, Text } from 'native-base';
import React, { PureComponent } from 'react';
import { FlatList, FlatListStatic, View } from 'react-native';

import { IBibleBook } from '../../../interfaces/bible';
import { toastError } from '../../../providers/toast';
import bibleDatabase from '../../../services/database/bible';
import { isiOS } from '../../../settings';
import BaseComponent from '../../../shared/abstract/baseComponent';
import { classes } from '../../../theme';

const ITEM_HEIGHT = isiOS ? 45 : 54;
const ITEM_OFFSET = (index: number) => (ITEM_HEIGHT * index) - (ITEM_HEIGHT * 2);

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
    const { value } = this.props;

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
          { length: ITEM_HEIGHT, offset: ITEM_OFFSET(index), index }
        )}
        renderItem={this.renderItem.bind(this)} />
    );
  }

  public renderItem({ item }: { item: IBibleBook }): JSX.Element {
    const { value, onChange } = this.props;

    return <BookItem
      book={item}
      onChange={onChange}
      selected={value === item.id}
    />;
  }
}

class BookItem extends PureComponent<{
  selected: boolean,
  book: IBibleBook,
  onChange: Function
}> {
  public render(): JSX.Element {
    const { selected, book, onChange } = this.props;

    return (
      <ListItem
        selected={selected}
        button
        style={classes.listItem}
        onPress={() => onChange(book)}>
        <Body>
          <Text>{book.name}</Text>
        </Body>
        <Right>
          <Radio selected={selected} />
        </Right>
      </ListItem>
    );
  }
}