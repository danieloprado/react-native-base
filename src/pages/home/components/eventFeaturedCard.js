import { Button, Card, CardItem, H2, Text, View } from 'native-base';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';

import BaseComponent from '../../../components/base';
import dateFormatter from '../../../formatters/date';
import serivces from '../../../services';
import { theme, variables } from '../../../theme';

class EventFeaturedCard extends BaseComponent {
  constructor(props) {
    super(props);

    this.eventService = serivces.get('eventService');
    this.state = { loading: true };
  }

  componentDidMount() {
    this.eventService.next(true)
      .logError()
      .bindComponent(this)
      .last()
      .subscribe(event => {
        this.setState({ loading: false, event });
      }, () => this.setState({ loading: false }));
  }

  details() {
    const { event } = this.state;
    this.navigate('EventDetails', { event, date: event.dates[0] });
  }

  render() {
    const { event, loading } = this.state;

    return (
      <View>
        {!loading && !!event &&
          <Card>
            <Image style={styles.image} source={{ uri: 'http://icbnews.com.br/wp-content/uploads/2015/09/encontro-com-o-amor-de-deus-1024x639.jpg' }} />
            <CardItem header style={styles.header}>
              <View>
                <H2>{event.title}</H2>
                <Text note>
                  {dateFormatter.format(event.dates[0].beginDate, 'dddd, DD [de] MMMM [de] YYYY [às] HH:mm')}
                </Text>
              </View>
            </CardItem>
            <CardItem>
              <Text>{event.featuredText}</Text>
            </CardItem>
            <CardItem footer style={theme.alignRight}>
              <Button transparent onPress={() => this.details()}>
                <Text>DETALHES</Text>
              </Button>
            </CardItem>
          </Card>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: variables.deviceHeight * 0.2,
    resizeMode: 'cover'
  },
  header: {
    paddingBottom: 0
  },
  viewContent: {
    width: variables.deviceWidth - 120
  }
});

export default withNavigation(EventFeaturedCard);