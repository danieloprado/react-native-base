import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title, View } from 'native-base';
import * as React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';

import { BaseComponent } from '../../components/base';
import EmptyMessage from '../../components/emptyMessage';
import { dateFormatter } from '../../formatters/date';
import eventListFormatter from '../../formatters/eventList';
import toast from '../../providers/toast';
import services from '../../services';

export default class EventListPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Agenda',
    drawerIcon: ({ tintColor }) => (
      <Icon name="calendar" style={{ color: tintColor }} />
    )
  };

  constructor(props: any) {
    super(props);

    this.eventService = services.get('eventService');
    this.state = { refreshing: true, error: false, eventGroup: [] };
  }

  componentDidMount() {
    this.load();
  }

  details(eventData) {
    this.navigate('EventDetails', { event: eventData.event, date: eventData });
  }

  load(refresh = false) {
    this.setState({ refreshing: true }, true);

    this.eventService.list(refresh)
      .logError()
      .bindComponent(this)
      .subscribe(events => {
        const eventGroup = eventListFormatter(events || []);
        this.setState({ refreshing: false, error: false, eventGroup });
      }, () => {
        if (refresh) toast('Não conseguimos atualizar');
        this.setState({ refreshing: false, error: true });
      });
  }

  public render(): JSX.Element {
    const { refreshing, error, eventGroup } = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Agenda</Title>
          </Body>
          <Right />
        </Header>
        <Content refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => this.load(true)} />
        }>
          {!refreshing && error && !eventGroup.length &&
            <EmptyMessage icon="sad" message="Não conseguimos atualizar" />
          }
          {!refreshing && !error && !eventGroup.length &&
            <EmptyMessage icon="calendar" message="Nenhum evento próximo" />
          }
          <List dataArray={eventGroup} renderRow={(data, sectionId, rowId) => this.renderRow(data, rowId)} />
        </Content>
      </Container>
    );
  }

  renderRow(data, rowId) {
    return (
      <View key={data.divider ? data.beginDate : data.event.id}>
        {data.divider ?
          <ListItem style={rowId === '0' ? styles.listItemHeaderFirst : styles.listItemHeader}>
            <Text style={styles.listItemHeaderText}>
              {dateFormatter.format(data.date, 'MMMM').toUpperCase()}
            </Text>
          </ListItem>
          :
          <ListItem style={styles.listItem}>
            {data.firstOfDate ?
              <Left style={styles.leftWrapper}>
                <Text style={styles.eventDay}>
                  {dateFormatter.format(data.beginDate, 'DD')}
                </Text>
                <Text style={styles.eventWeekDay}>
                  {dateFormatter.format(data.beginDate, 'ddd')}
                </Text>
              </Left>
              :
              <Left style={styles.leftWrapper} />
            }
            <Body>
              <Button
                block
                onPress={() => this.details(data)}
                style={styles.buttonDetails}>
                <Text style={styles.eventTitle}>{data.event.title}</Text>
                <Text style={styles.eventHour}>
                  {
                    dateFormatter.format(data.beginDate, 'HH:mm') +
                    (data.endDate ? ' - ' + dateFormatter.format(data.endDate, 'HH:mm') : '')
                  }
                </Text>
              </Button>
            </Body>
          </ListItem>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItemHeader: {
    borderBottomWidth: 0,
    marginTop: 20
  },
  listItemHeaderFirst: {
    borderBottomWidth: 0,
  },
  listItemHeaderText: {
    fontWeight: 'bold',
    opacity: 0.6
  },
  listItem: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  leftWrapper: {
    maxWidth: 50,
    opacity: 0.5,
    flexDirection: 'column'
  },
  eventDay: {
    fontSize: 24,
    textAlign: 'center'
  },
  eventWeekDay: {
    textAlign: 'center'
  },
  eventTitle: {
    fontSize: 16,
    marginBottom: 2,
    lineHeight: 22
  },
  eventHour: {
    opacity: 0.8
  },
  icon: {
    width: 40,
    fontSize: 30
  },
  buttonDetails: {
    marginLeft: 15,
    height: null,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10
  }
});