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
import { Clipboard, FlatList, FlatListStatic, Share, StyleSheet } from 'react-native';
import { NavigationTabScreenOptions } from 'react-navigation';

import { IBibleBook, IBibleCapter, IBibleVerse } from '../../interfaces/bible';
import { toast, toastError } from '../../providers/toast';
import bibleDatabase from '../../services/database/bible';
import { isiOS } from '../../settings';
import BaseComponent from '../../shared/abstract/baseComponent';
import { classes, theme } from '../../theme';
import BibleModalPicker from './components/modalPicker';

interface IBibleVerseSelectable extends IBibleVerse {
  selected?: boolean;
}

interface IState {
  loading: boolean;
  book?: IBibleBook;
  capter?: IBibleCapter;
  verses?: IBibleVerseSelectable[];
}

export default class BiblePage extends BaseComponent<IState> {
  public static navigationOptions: NavigationTabScreenOptions = {
    tabBarLabel: 'Bíblia',
    tabBarIcon: ({ tintColor }) => (
      <Icon name='bookmarks' style={{ color: tintColor }} />
    )
  };

  private modalPicker: BibleModalPicker;
  private flatListRef: FlatListStatic<IBibleVerse>;

  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  get selecting(): boolean {
    return this.state.verses && this.state.verses.some(v => v.selected);
  }

  public componentDidMount(): void {
    bibleDatabase.current()
      .bindComponent(this)
      .logError()
      .subscribe(async ({ book, capter, verses }) => {
        verses = [...verses, { id: 'empty' } as any];
        await this.setState({ book, capter, verses, loading: false });
        this.flatListRef.scrollToIndex({ index: 0 });
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
    this.modalPicker.show(book.id, capter.id)
      .logError()
      .bindComponent(this)
      .filter(data => !!data)
      .subscribe(({ bookId, capterId }) => {
        this.setState({ loading: true }, true);
        bibleDatabase.change(bookId, capterId);
      }, err => toastError(err));
  }

  public toggleSelected(verse: IBibleVerseSelectable): void {
    verse.selected = !verse.selected;

    const { verses } = this.state;
    this.setState({ verses });
  }

  public clearSelection(): void {
    const { verses } = this.state;

    verses.forEach(v => v.selected = false);
    this.setState({ verses });
  }

  public copySelection(): void {
    Clipboard.setString(this.generateVerseText());
    toast('Copiado', 3000);
    this.clearSelection();
  }

  public async shareSelection(): Promise<void> {
    const { book, capter } = this.state;
    const message = this.generateVerseText();

    await Share.share({
      title: `${book.name} ${capter.id}`,
      message
    });

    this.clearSelection();
  }

  public generateVerseText(): string {
    const { book, capter, verses } = this.state;

    return `${verses.filter(v => v.selected).map(verse => {
      return `${verse.reference}. ${verse.text}`;
    }).join('\n')}\n\n${book.name} ${capter.id}`;
  }

  public render(): JSX.Element {
    const { loading, capter, verses } = this.state;

    return (
      <Container>
        <BibleModalPicker ref={modalPicker => this.modalPicker = modalPicker} />
        {!this.selecting &&
          <Header>
            <Left />
            <Body>
              <Segment>
                <Button first last active onPress={() => this.showPicker()}>
                  <Text>{this.getTitle()}</Text>
                </Button>
              </Segment>
            </Body>
            <Right />
          </Header>
        }
        {!!this.selecting &&
          <Header>
            <Left>
              <Button transparent onPress={() => this.clearSelection()}>
                <Icon name='close' />
              </Button>
            </Left>
            <Body />
            <Right>
              <Button transparent onPress={() => this.copySelection()}>
                <Icon name='copy' />
              </Button>
              <Button transparent onPress={() => this.shareSelection()}>
                <Icon name='share' />
              </Button>
            </Right>
          </Header>
        }
        {loading &&
          <Content padder>
            <Spinner />
          </Content>
        }

        {!loading &&
          <FlatList
            ref={(ref: any) => this.flatListRef = ref}
            keyExtractor={verse => verse.id.toString()}
            extraData={verses.map(v => v.selected)}
            data={verses}
            renderItem={({ item, index }) => this.renderRow(item, index)}
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

  public renderRow(verse: IBibleVerseSelectable, index: number): JSX.Element {
    if (verse.id as any === 'empty') {
      return (
        <ListItem style={[classes.listItem, styles.listItem]}>
          <Body style={styles.bodyEmpty} />
        </ListItem>
      );
    }

    if (!verse.reference) {
      return (
        <ListItem style={[classes.listItem, styles.listItem]}>
          <Body>
            <Text style={index === 0 ? styles.titleNoMargin : styles.title}>{verse.text}</Text>
          </Body>
        </ListItem>
      );
    }

    return (
      <ListItem
        button
        style={[classes.listItem, styles.listItem]}
        onPress={() => this.selecting && this.toggleSelected(verse)}
        onLongPress={() => this.toggleSelected(verse)}
        selected={verse.selected}>
        <Body>
          <Text>
            <Text style={styles.reference}>{verse.reference + '.  '}</Text>
            {verse.text}
          </Text>
        </Body>
      </ListItem>
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
    backgroundColor: isiOS ? theme.accent : theme.primary
  }
});