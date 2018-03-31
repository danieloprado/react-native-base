import { Button, Card, CardItem, H2, Text, View } from 'native-base';
import * as React from 'react';
import { Image, StyleSheet } from 'react-native';

import { WithNavigation } from '../../../decorators/withNavigation';
import { dateFormatter } from '../../../formatters/date';
import { IEvent } from '../../../interfaces/event';
import eventService from '../../../services/event';
import BaseComponent from '../../../shared/abstract/baseComponent';
import { classes, theme } from '../../../theme';

interface IState {
  loading: boolean;
  event?: IEvent;
  error?: any;
}

@WithNavigation()
export default class EventFeaturedCard extends BaseComponent<IState> {

  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    eventService.next(true)
      .logError()
      .bindComponent(this)
      .last()
      .subscribe(event => {
        this.setState({ loading: false, event });
      }, () => this.setState({ loading: false }));
  }

  public details(): void {
    const { event } = this.state;
    this.navigate('EventDetails', { event, date: event.dates[0] });
  }

  public render(): JSX.Element {
    const { event, loading } = this.state;

    return (
      <View>
        {!loading && !!event &&
          <Card>
            {!!event.image &&
              <Image
                style={styles.image}
                source={{ uri: event.image }}
              />
            }
            <CardItem header style={styles.header}>
              <View>
                <H2>{event.title}</H2>
                <Text note>
                  {dateFormatter.format(event.dates[0].beginDate, 'dddd, DD [de] MMMM [de] YYYY [às] HH:mm')}
                </Text>
              </View>
            </CardItem>
            {!!event.featuredText &&
              <CardItem>
                <Text>{event.featuredText}</Text>
              </CardItem>
            }
            <CardItem footer style={classes.alignRight}>
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
    height: theme.deviceHeight * 0.2,
    resizeMode: 'cover'
  },
  header: {
    paddingBottom: 0
  },
  viewContent: {
    width: theme.deviceWidth - 120
  }
});