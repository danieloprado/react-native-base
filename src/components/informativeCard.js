import { Body, Button, Card, CardItem, Icon, Right, Spinner, Text, View } from 'native-base';
import React from 'react';

import dateFormatter from '../formatters/date';
import services from '../services';
import { theme } from '../theme';
import BaseComponent from './base';

export default class InformativeCard extends BaseComponent {
  constructor(props) {
    super(props);

    this.informativeService = services.get('informativeService');
    this.state = { loading: true };
  }

  componentDidMount() {
    this.informativeService.last()
      .logError()
      .bindComponent(this)
      .subscribe(informative => {
        this.setState({ loading: false, informative, error: false });
      }, () => this.setState({ loading: false, error: true }));
  }

  render() {
    const { informative, loading, error } = this.state;

    return (
      <Card>
        <CardItem header>
          <Text>Último informativo</Text>
        </CardItem>
        {loading &&
          <CardItem>
            <Body style={theme.alignCenter}>
              <Spinner />
            </Body>
          </CardItem>
        }
        {!loading && error &&
          <CardItem style={theme.alignCenter}>
            <Text note>Não conseguimos atualizar</Text>
          </CardItem>
        }
        {!loading && !error &&
          <View>
            <CardItem button onPress={() => this.navigate('InformativeDetails', { informative })}>
              <Icon name={informative.icon} />
              <View>
                <Text>{informative.title}</Text>
                <Text note>{dateFormatter.format(informative.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
              </View>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>
            <CardItem footer style={theme.alignRight}>
              <Button transparent onPress={() => this.navigate('Informative')}>
                <Text>VER TODOS</Text>
              </Button>
            </CardItem>
          </View>
        }
      </Card>
    );
  }
}