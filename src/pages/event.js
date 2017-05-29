import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title, View } from 'native-base';
import { RefreshControl, StyleSheet } from 'react-native';

import BaseComponent from '../components/base';
import React from 'react';
import dateFormatter from '../formatters/date';
import eventListFormatter from '../formatters/eventList';
import eventService from '../services/event';
import theme from '../theme';

export default class EventPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Agenda',
    drawerIcon: ({ tintColor }) => (
      <Icon name="calendar" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
    this.state = { refreshing: true, error: false, eventGroup: [] };
  }

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  details(eventData) {
    this.navigate('EventDetails', { event: eventData.event, date: eventData });
  }

  load(refresh = false) {
    this.setState({ refreshing: true }, true);

    this.subscription = eventService.list(refresh).subscribe(events => {
      const eventGroup = eventListFormatter(events || []);
      this.setState({ refreshing: false, error: false, eventGroup });
    }, () => {
      this.setState({ refreshing: false, error: true });
    });
  }

  render() {
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this.load(true)}
          />
        }>
          {!refreshing && error &&
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Não foi possível carregar</Text>
            </View>
          }
          {!refreshing && !error && !eventGroup.length &&
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Nenhum evento próximo</Text>
            </View>
          }
          <List dataArray={eventGroup} renderRow={(data, sectionId, rowId) => this.renderRow(data, rowId)} />
        </Content>
      </Container>
    );
  }

  renderRow(data, rowId) {
    console.log(rowId, data);
    return (
      <View key={data.divider ? data.beginDate : data.event.id}>
        {data.divider ?
          <ListItem style={StyleSheet.flatten(rowId === '0' ? styles.listItemHeaderFirst : styles.listItemHeader)}>
            <Text style={StyleSheet.flatten(styles.listItemHeaderText)}>
              {dateFormatter.format(data.date, 'MMMM').toUpperCase()}
            </Text>
          </ListItem>
          :
          <ListItem style={StyleSheet.flatten(styles.listItem)}>
            {data.firstOfDate ?
              <Left style={StyleSheet.flatten(styles.leftWrapper)}>
                <Text style={StyleSheet.flatten(styles.eventDay)}>
                  {dateFormatter.format(data.beginDate, 'DD')}
                </Text>
                <Text style={StyleSheet.flatten(styles.eventWeekDay)}>
                  {dateFormatter.format(data.beginDate, 'ddd')}
                </Text>
              </Left>
              :
              <Left style={StyleSheet.flatten(styles.leftWrapper)} />
            }
            <Body>
              <Button
                block
                onPress={() => this.details(data)}
                style={StyleSheet.flatten(styles.buttonDetails)}>
                <Text style={StyleSheet.flatten(styles.eventTitle)}>{data.event.title}</Text>
                <Text style={StyleSheet.flatten(styles.eventHour)}>
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