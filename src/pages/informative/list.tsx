import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title } from 'native-base';
import * as React from 'react';
import { RefreshControl } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import { ErrorMessage } from '../../components/errorMessage';
import { dateFormatter } from '../../formatters/date';
import { IInformative } from '../../interfaces/informative';
import { toast } from '../../providers/toast';
import informativeService from '../../services/informative';
import { classes } from '../../theme';

interface IState extends IStateBase {
  refreshing: boolean;
  informatives: IInformative[];
  error?: any;
}

export default class InformativeListPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Informativos' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='paper' style={{ color: tintColor }} />
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
        if (refresh) toast('Não conseguimos atualizar');
        this.setState({ refreshing: false, error });
      });
  }

  public render(): JSX.Element {
    const { refreshing, informatives, error } = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
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