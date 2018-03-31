import { Body, Button, Container, Header, Icon, Left, Right, Tab, Tabs, Title } from 'native-base';
import * as React from 'react';
import { Modal } from 'react-native';
import { Subject } from 'rxjs';

import { IBibleBook, IBibleCapter } from '../../../interfaces/bible';
import BaseComponent from '../../../shared/abstract/baseComponent';
import BibleListBooks from './listBooks';
import BibleListCapters from './listCapters';

interface IModel {
  bookId: number;
  capterId: number;
}

interface IState {
  show: boolean;
  capters?: IBibleCapter[];
  model?: IModel;
}

export default class BibleModalPicker extends BaseComponent<IState> {
  private result$: Subject<IModel>;
  private tabs: any;

  constructor(props: any) {
    super(props);

    this.result$ = null;
    this.state = { show: false };
  }

  public show(bookId: number, capterId: number): Subject<IModel> {
    this.setState({ show: true, model: { bookId, capterId } });

    this.result$ = new Subject();
    return this.result$;
  }

  public async changeBook(book: IBibleBook): Promise<void> {
    const { model } = this.state;
    model.bookId = book.id;

    await this.setState({ model });
    this.tabs.goToPage(1);
  }

  public async changeCapter(capter: IBibleCapter): Promise<void> {
    const { model } = this.state;
    model.capterId = capter.id;

    this.result$.next(model);
    this.result$.complete();

    this.setState({ model, show: false });
  }

  public render(): JSX.Element {
    const { show, model } = this.state;

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
            <Tabs ref={ref => this.tabs = ref}>
              <Tab heading='Livros'>
                <BibleListBooks value={model.bookId} onChange={v => this.changeBook(v)} />
              </Tab>
              <Tab heading='Capítulos'>
                <BibleListCapters bookId={model.bookId} onChange={v => this.changeCapter(v)} />
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