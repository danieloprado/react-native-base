import { Body, Button, Container, Header, Icon, Left, List, ListItem, Right, Tab, Tabs, Text, Title } from 'native-base';
import * as React from 'react';
import { Modal } from 'react-native';
import { Subject } from 'rxjs';

import { BaseComponent, IStateBase } from '../../../components/base';
import bibleDatabase from '../../../database/bible';
import { IBibleBook } from '../../../interfaces/bible/book';
import { toastError } from '../../../providers/toast';
import { classes } from '../../../theme';

interface IState extends IStateBase {
  show: boolean;
  books?: IBibleBook[];
}

export default class BibleModalPicker extends BaseComponent<IState> {
  private result$: Subject<{ book: number, capter: number; }>;

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

  public show(): Subject<{ book: number, capter: number; }> {
    this.setState({ show: true });

    this.result$ = new Subject();
    return this.result$;
  }

  public render(): JSX.Element {
    const { show, books } = this.state;

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
                <List dataArray={books} renderRow={(book: IBibleBook) =>
                  <ListItem button key={book.id} style={classes.listItem}>
                    <Body>
                      <Text>{book.name}</Text>
                    </Body>
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