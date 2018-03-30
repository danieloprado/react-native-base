import { Body, Button, Container, Header, Icon, Left, ListItem, Radio, Right, Tab, Tabs, Text, Title } from 'native-base';
import * as React from 'react';
import { FlatList, Modal } from 'react-native';
import { Subject } from 'rxjs';

import { IBibleBook } from '../../../interfaces/bible';
import { InteractionManager } from '../../../providers/interactionManager';
import { toastError } from '../../../providers/toast';
import bibleDatabase from '../../../services/database/bible';
import BaseComponent from '../../../shared/abstract/baseComponent';
import { classes } from '../../../theme';

interface IModel {
  bookId: number;
  capterId: number;
}

interface IState {
  show: boolean;
  books?: IBibleBook[];
  model?: IModel;
}

export default class BibleModalPicker extends BaseComponent<IState> {
  private result$: Subject<IModel>;
  private bookList: FlatList<IBibleBook>;

  constructor(props: any) {
    super(props);

    this.result$ = null;
    this.state = { show: false };
  }

  public componentDidMount(): void {
    bibleDatabase.listBooks()
      .logError()
      .bindComponent(this)
      .subscribe(books => {
        this.setState({ books });
      }, err => toastError(err));
  }

  public show(bookId: number, capterId: number): Subject<IModel> {
    this.setState({ show: true, model: { bookId, capterId } }).then(async () => {
      await InteractionManager.runAfterInteractions();
      setTimeout(() => this.bookList.scrollToIndex({ index: bookId }), 1000);
    });

    this.result$ = new Subject();
    return this.result$;
  }

  public changeBook(book: IBibleBook): void {
    const { model } = this.state;
    model.bookId = book.id;

    this.setState({ model });
  }

  public render(): JSX.Element {
    const { show, books, model } = this.state;

    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={show}
        onRequestClose={() => this.hide()}>
        <Container>

          <Header hasTabs>
            <Left>
              <Button transparent onPress={() => this.hide()}>
                <Icon name='close' />
              </Button>
            </Left>
            <Body>
              <Title>Selecione</Title>
            </Body>
            <Right />
          </Header>

          {show &&
            <Tabs>
              <Tab heading='Livros'>
                <FlatList
                  ref={(ref: any) => this.bookList = ref}
                  keyExtractor={book => book.id.toString()}
                  extraData={model.bookId}
                  data={books}
                  getItemLayout={(data, index) => (
                    { length: 43, offset: 43 * index, index }
                  )}
                  renderItem={({ item }: { item: IBibleBook }) =>
                    <ListItem
                      selected={model.bookId === item.id}
                      button
                      style={classes.listItem}
                      onPress={() => this.changeBook(item)}>
                      <Body>
                        <Text>{item.name}</Text>
                      </Body>
                      <Right>
                        <Radio selected={model.bookId === item.id} />
                      </Right>
                    </ListItem>
                  } />
              </Tab>
              <Tab heading='Capítulos'>
              </Tab>
            </Tabs>
          }

        </Container>
      </Modal>
    );
  }

  private hide(): void {
    this.result$.next(null);
    this.result$.complete();

    this.setState({ show: false });
  }
}