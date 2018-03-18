import { Body, Button, Card, CardItem, Icon, Right, Spinner, Text, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { BaseComponent, IStateBase } from '../../../components/base';
import { dateFormatter } from '../../../formatters/date';
import { IInformative } from '../../../interfaces/informative';
import { theme, variables } from '../../../theme';
import informativeService from '../../../services/informative';
import { WithNavigation } from '../../../decorators/withNavigation';

interface IState extends IStateBase {
  loading: boolean;
  informative?: IInformative;
  error?: any;
}

@WithNavigation()
export default class InformativeCard extends BaseComponent<IState> {
  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    informativeService.last()
      .logError()
      .bindComponent(this)
      .subscribe(informative => {
        this.setState({ loading: false, informative, error: false });
      }, () => this.setState({ loading: false, error: true }));
  }

  public render(): JSX.Element {
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
        {!loading && error && !informative &&
          <CardItem style={theme.alignCenter}>
            <Text note>Não conseguimos atualizar</Text>
          </CardItem>
        }
        {!loading && !error && !informative &&
          <CardItem style={theme.alignCenter}>
            <Text note>Nenhum informativo criado</Text>
          </CardItem>
        }
        {!loading && informative &&
          <View>
            <CardItem button onPress={() => this.navigate('InformativeDetails', { informative })}>
              <Icon name={informative.icon} />
              <View style={styles.viewContent}>
                <Text numberOfLines={1}>{informative.title}</Text>
                <Text note>{dateFormatter.format(informative.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
              </View>
              <Right>
                <Icon name='arrow-forward' />
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

const styles = StyleSheet.create({
  viewContent: {
    width: variables.deviceWidth - 120
  }
});