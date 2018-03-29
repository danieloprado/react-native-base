import {
  Body,
  Button,
  Container,
  Content,
  Fab,
  Header,
  Icon,
  Left,
  ListItem,
  Right,
  Segment,
  Spinner,
  Text,
} from 'native-base';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import bibleDatabase from '../../database/bible';
import { IBibleData } from '../../interfaces/bible/data';
import { toastError } from '../../providers/toast';
import { classes, theme } from '../../theme';
import BibleModalPicker from './components/modalPicker';

interface IState extends IStateBase, Partial<IBibleData> {
  loading: boolean;
}

export default class BiblePage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Bíblia - A Mensagem',
    drawerIcon: ({ tintColor }) => (
      <Icon name='bookmarks' style={{ color: tintColor }} />
    )
  };

  private modalPicker: BibleModalPicker;

  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    bibleDatabase.current()
      .bindComponent(this)
      .logError()
      .subscribe(async ({ book, capter, verses }) => {
        verses.push({ id: 'empty' } as any);
        await this.setState({ book, capter, verses, loading: false });

        this.showPicker();
      }, err => toastError(err));
  }

  public getTitle(): string {
    const { loading, book, capter } = this.state;
    if (loading) return 'Carregando';

    return `${book.name} ${capter.id}`;
  }

  public changeCapter(capter: number): void {
    const { book } = this.state;
    this.setState({ loading: true }, true);

    bibleDatabase.change(book.id, capter);
  }

  public showPicker(): void {
    const { loading, book, capter } = this.state;

    if (loading) return;
    this.modalPicker.show(book.id, capter.id);
  }

  public render(): JSX.Element {
    const { loading, capter, verses } = this.state;

    return (
      <Container>
        <BibleModalPicker ref={modalPicker => this.modalPicker = modalPicker} />
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Segment>
              <Button first last active onPress={() => this.showPicker()}>
                <Text>{this.getTitle()}</Text>
              </Button>
            </Segment>
          </Body>
          <Right />
        </Header>
        {loading &&
          <Content padder>
            <Spinner />
          </Content>
        }

        {!loading &&
          <FlatList
            keyExtractor={verse => verse.id.toString()}
            data={verses}
            renderItem={({ item, index }) =>
              <ListItem button style={[classes.listItem, styles.listItem]}>
                <Body style={item.id !== 'empty' ? null : styles.bodyEmpty}>
                  {!item.reference && item.id !== 'empty' &&
                    <Text style={index === 0 ? styles.titleNoMargin : styles.title}>{item.text}</Text>
                  }
                  {!!item.reference && item.id !== 'empty' &&
                    <Text>
                      <Text style={styles.reference}>{item.reference + '  '}</Text>
                      {item.text}
                    </Text>
                  }
                </Body>
              </ListItem>
            }
          />
        }

        {!loading && !!capter.previous &&
          <Fab
            style={styles.fab}
            position='bottomLeft'
            onPress={() => this.changeCapter(capter.previous)}>
            <Icon name='arrow-back' />
          </Fab>
        }

        {!loading && !!capter.next &&
          <Fab
            style={styles.fab}
            position='bottomRight'
            onPress={() => this.changeCapter(capter.next)}>
            <Icon name='arrow-forward' />
          </Fab>
        }
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 0
  },
  title: {
    fontWeight: 'bold',
    marginTop: 30
  },
  titleNoMargin: {
    fontWeight: 'bold'
  },
  reference: {
    fontWeight: 'bold',
    fontSize: 13
  },
  bodyEmpty: {
    height: 40
  },
  fab: {
    height: 40,
    width: 40,
    backgroundColor: theme.platform === 'ios' ? theme.accent : theme.primary
  }
});