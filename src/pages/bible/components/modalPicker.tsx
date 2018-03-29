import { Body, Button, Container, Header, Icon, Left, ListItem, Radio, Right, Tab, Tabs, Text, Title } from 'native-base';
import * as React from 'react';
import { ListView, ListViewDataSource, Modal } from 'react-native';
import { Subject } from 'rxjs';

import { BaseComponent, IStateBase } from '../../../components/base';
import bibleDatabase from '../../../database/bible';
import { IBibleBook } from '../../../interfaces/bible/book';
import { toastError } from '../../../providers/toast';
import { classes } from '../../../theme';

interface IModel {
  bookId: number;
  capterId: number;
}

interface IState extends IStateBase<IModel> {
  show: boolean;
  books?: IBibleBook[];
}

export default class BibleModalPicker extends BaseComponent<IState> {
  private result$: Subject<IModel>;
  private dataSource: ListViewDataSource;

  constructor(props: any) {
    super(props);

    this.result$ = null;
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
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
    this.setState({ show: true, model: { bookId, capterId } });

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
    console.log(model);

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
                <ListView dataSource={this.dataSource.cloneWithRows(books)} renderRow={(book: IBibleBook) =>
                  <ListItem
                    selected={model.bookId === book.id}
                    button
                    key={book.id}
                    style={classes.listItem}
                    onPress={() => this.changeBook(book)}>
                    <Body>
                      <Text>{book.name}</Text>
                    </Body>
                    <Right>
                      <Radio selected={model.bookId === book.id} />
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