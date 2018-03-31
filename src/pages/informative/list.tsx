import { Body, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title } from 'native-base';
import * as React from 'react';
import { RefreshControl } from 'react-native';
import { NavigationTabScreenOptions } from 'react-navigation';

import { dateFormatter } from '../../formatters/date';
import { IInformative } from '../../interfaces/informative';
import { toastError } from '../../providers/toast';
import informativeService from '../../services/informative';
import { isiOS } from '../../settings';
import BaseComponent from '../../shared/abstract/baseComponent';
import { ErrorMessage } from '../../shared/errorMessage';
import { classes } from '../../theme';

interface IState {
  refreshing: boolean;
  informatives: IInformative[];
  error?: any;
}

export default class InformativeListPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationTabScreenOptions = {
    tabBarLabel: 'Informativos' as any,
    tabBarIcon: ({ tintColor }) => (
      <Icon name='document' style={{ color: tintColor }} />
    )
  };

  constructor(props: any) {
    super(props);
    this.state = { refreshing: true, informatives: [] };
  }

  public componentDidMount(): void {
    this.load();
  }

  public details(informative: IInformative): void {
    this.navigate('InformativeDetails', { informative });
  }

  public load(refresh: boolean = false): void {
    this.setState({ refreshing: true }, true);

    informativeService.list(refresh)
      .logError()
      .bindComponent(this)
      .subscribe(informatives => {
        informatives = informatives || [];
        this.setState({ refreshing: false, informatives, error: false });
      }, error => {
        if (refresh) toastError('Não conseguimos atualizar');
        this.setState({ refreshing: false, error });
      });
  }

  public render(): JSX.Element {
    const { refreshing, informatives, error } = this.state;

    return (
      <Container>
        <Header>
          {isiOS ? <Left /> : null}
          <Body>
            <Title>Informativos</Title>
          </Body>
          <Right />
        </Header>
        <Content
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => this.load(true)} />
          }
        >
          {!refreshing && error && !informatives.length &&
            <ErrorMessage error={error} />
          }
          <List dataArray={informatives} renderRow={informative =>
            <ListItem button key={informative.id} style={classes.listItem} onPress={() => this.details(informative)}>
              <Left style={classes.listIconWrapper}>
                <Icon name={informative.icon} style={classes.listIcon} />
              </Left>
              <Body>
                <Text>{informative.title}</Text>
                <Text note>{dateFormatter.format(informative.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
              </Body>
              <Right style={classes.listIconWrapperSmall}>
                <Icon name='arrow-forward' />
              </Right>
            </ListItem>
          }
          />
        </Content>
      </Container>
    );
  }
}