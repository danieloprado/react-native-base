import { Body, ListItem, Radio, Right, Spinner, Text } from 'native-base';
import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';

import { IBibleBook } from '../../../interfaces/bible';
import { toastError } from '../../../providers/toast';
import bibleDatabase from '../../../services/database/bible';
import { isiOS } from '../../../settings';
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
  constructor(props: any) {
    super(props);
    this.state = { books: null };
  }

  public componentDidMount(): void {
    bibleDatabase.listBooks()
      .logError()
      .bindComponent(this)
      .delay(100)
      .subscribe(books => {
        this.setState({ books });
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
        keyExtractor={book => book.id.toString()}
        extraData={value}
        data={books}
        initialScrollIndex={value}
        getItemLayout={this.getItemLayout.bind(this)}
        renderItem={this.renderItem.bind(this)}
      />
    );
  }

  public getItemLayout(data: IBibleBook[], index: number): any {
    const height = isiOS ? 45 : 54;

    return {
      length: height,
      offset: (height * index) - (height * 2),
      index
    };
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