import { Body, Button, Card, CardItem, Icon, Spinner, Text, View } from 'native-base';
import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';

import { WithNavigation } from '../../../decorators/withNavigation';
import { phoneFormatter } from '../../../formatters/phone';
import { IChurch } from '../../../interfaces/church';
import churchService from '../../../services/church';
import BaseComponent from '../../../shared/abstract/baseComponent';
import { classes } from '../../../theme';

interface IState {
  loading: boolean;
  church?: IChurch;
  error?: any;
}

@WithNavigation()
export default class ChurchCard extends BaseComponent<IState> {

  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    churchService.info()
      .logError()
      .bindComponent(this)
      .subscribe(church => {
        this.setState({ loading: false, church });
      }, () => this.setState({ loading: false }));
  }

  public openPhone(): void {
    Linking.openURL(`tel:${this.state.church.phone}`);
  }

  public openAddress(): void {
    const church = this.state.church;
    Linking.openURL(`geo:${church.latitude},${church.longitude}?q=${church.address}`);
  }

  public render(): JSX.Element {
    const { church, loading } = this.state;

    return (
      <Card>
        <CardItem header>
          <Text>{(church || { name: 'Igreja' }).name}</Text>
        </CardItem>
        {loading &&
          <CardItem>
            <Body style={classes.alignCenter}>
              <Spinner />
            </Body>
          </CardItem>
        }
        {!loading && !church &&
          <CardItem style={classes.alignCenter}>
            <Text note>Não conseguimos atualizar</Text>
          </CardItem>
        }
        {!loading && church &&
          <View>
            {!!church.phone &&
              <CardItem button onPress={() => this.openPhone()}>
                <Icon name='call' />
                <Text>{phoneFormatter(church.phone)}</Text>
              </CardItem>
            }
            {!!church.address &&
              <CardItem button onPress={() => this.openAddress()}>
                <Icon name='pin' />
                <Text style={classes.cardItemMultiline}>
                  {church.address}
                </Text>
              </CardItem>
            }
            <CardItem footer style={classes.alignRight}>
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

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center'
  },
  logo: {
    height: 100,
    width: 100
  }
});