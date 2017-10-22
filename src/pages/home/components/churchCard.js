import { Body, Button, Card, CardItem, Icon, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Linking } from 'react-native';
import { withNavigation } from 'react-navigation';

import BaseComponent from '../../../components/base';
import phoneFormatter from '../../../formatters/phone';
import services from '../../../services';
import { theme } from '../../../theme';

class ChurchCard extends BaseComponent {
  constructor(props) {
    super(props);

    this.churchService = services.get('churchService');
    this.state = { loading: true };
  }

  componentDidMount() {
    this.churchService.info()
      .logError()
      .bindComponent(this)
      .subscribe(church => {
        this.setState({ loading: false, church });
      }, () => this.setState({ loading: false }));
  }

  openPhone() {
    Linking.openURL(`tel:${this.state.church.phone}`);
  }

  openAddress() {
    const church = this.state.church;
    Linking.openURL(`geo:${church.latitude},${church.longitude}?q=${church.address}`);
  }

  render() {
    const { church, loading } = this.state;

    return (
      <Card>
        <CardItem header>
          <Text>Igreja</Text>
        </CardItem>
        {loading &&
          <CardItem>
            <Body style={theme.alignCenter}>
              <Spinner />
            </Body>
          </CardItem>
        }
        {!loading && !church &&
          <CardItem style={theme.alignCenter}>
            <Text note>Não conseguimos atualizar</Text>
          </CardItem>
        }
        {!loading && church &&
          <View>
            {!!church.phone &&
              <CardItem button onPress={() => this.openPhone()}>
                <Icon name="call" />
                <Text>{phoneFormatter(church.phone)}</Text>
              </CardItem>
            }
            {!!church.address &&
              <CardItem button onPress={() => this.openAddress()}>
                <Icon name="pin" />
                <Text style={theme.cardItemMultiline}>
                  {church.address}
                </Text>
              </CardItem>
            }
            <CardItem footer style={theme.alignRight}>
              <Button transparent onPress={() => this.navigate('Church')}>
                <Text>DETALHES</Text>
              </Button>
            </CardItem>
          </View>
        }

      </Card>
    );
  }
}

export default withNavigation(ChurchCard);