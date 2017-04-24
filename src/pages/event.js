import React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import BaseComponent from '../components/base';
import dateFormatter from '../formatters/date';
import eventListFormatter from '../formatters/eventList';
import eventService from '../services/event';
import Wrapper from '../theme/wrapper';
import {
  Content,
  Header,
  Left,
  Right,
  Body,
  Button,
  Title,
  Icon,
  Text,
  List,
  ListItem
} from 'native-base';

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
    this.state = { refreshing: true, eventGroup: [] };
  }

  componentDidMount() {
    this.load();
  }

  details(eventData) {
    this.navigate('EventDetails', { eventData });
  }

  load(refresh = false) {
    this.setState({ refreshing: true }, true);

    eventService.list(refresh).subscribe(events => {
      const eventGroup = eventListFormatter(events || []);
      this.setState({ refreshing: false, eventGroup });
    }, err => {
      console.log(err);
    });
  }

  render() {
    return (
      <Wrapper>
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
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.load(true)}
            />
          }
        >
          <List dataArray={this.state.eventGroup} renderRow={data =>
            data.divider ? 
              <ListItem itemHeader>
                <Text>{dateFormatter.format(data.date, 'MMMM')}</Text>
              </ListItem>
              :
              <ListItem style={StyleSheet.flatten(styles.listItem)}>
                {
                  data.firstOfDate ?
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
                      {dateFormatter.format(data.beginDate, 'HH:mm')}
                      {data.endDate ? ' - ' + dateFormatter.format(data.endDate, 'HH:mm') : ''}
                    </Text>
                  </Button>    
                </Body>
              </ListItem>
            }
          />
        </Content>  
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingTop: 6,
    paddingBottom: 6,
  },
  leftWrapper: {
    maxWidth: 50,
    flexDirection: 'column'
  },
  eventDay: {
    fontSize: 24
  },
  eventTitle: {
    fontSize: 18,
    marginBottom: 2
  },
  eventHour: {
    opacity: 0.8
  },
  icon: {
    width: 40,
    fontSize: 30
  },
  buttonDetails: {
    marginLeft: 10,
    height: null,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10
  }
});