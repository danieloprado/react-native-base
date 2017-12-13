import { Body, Button, Container, Content, Fab, Header, Icon, Left, Right, Title, View } from 'native-base';
import * as React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import { EmptyMessage } from '../../components/emptyMessage';
import { ErrorMessage } from '../../components/errorMessage';
import { IChurchReport } from '../../interfaces/churchReport';
import { alertError } from '../../providers/alert';
import { confirm } from '../../providers/confirm';
import { toast } from '../../providers/toast';
import * as services from '../../services';
import { ChurchReportService } from '../../services/models/churchReport';
import { theme } from '../../theme';
import { ChurchReportListComponent } from './components/list';

interface IState extends IStateBase {
  refreshing: boolean;
  reports: IChurchReport[];
  error?: any;
}

export default class ChurchReportListPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Relatório de Culto' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='list-box' style={{ color: tintColor }} />
    )
  };

  private churchReportService: ChurchReportService;

  constructor(props: any) {
    super(props);

    this.churchReportService = services.get('churchReportService');
    this.state = { refreshing: true, error: false, reports: [] };
  }

  public componentDidMount(): void {
    this.load();
  }

  public load(refresh: boolean = false): void {
    this.setState({ refreshing: true }, true);

    this.churchReportService.list(refresh)
      .logError()
      .bindComponent(this)
      .subscribe(reports => {
        this.setState({ refreshing: false, error: false, reports: reports || [] });
      }, error => {
        if (refresh) toast('Não conseguimos atualizar');
        this.setState({ refreshing: false, error });
      });
  }

  public onPressEdit(report: IChurchReport): void {
    this.navigate('ChurchReportForm', { report });
  }

  public onPressRemove(report: IChurchReport, index: number): void {
    confirm('Excluir', 'Deseja realmente apagar o relatório?', 'Sim', 'Não')
      .filter(ok => ok)
      .switchMap(() => this.churchReportService.remove(report.id).loader())
      .logError()
      .bindComponent(this)
      .subscribe(() => {
        this.state.reports.splice(index, 1);
        this.setState({ reports: this.state.reports });
      }, err => alertError(err).subscribe());
  }

  public render(): JSX.Element {
    const { refreshing, reports, error } = this.state;

    return (
      <Container style={theme.cardsContainer}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Relatório de Culto</Title>
          </Body>
          <Right />
        </Header>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => this.load(true)}
            />
          }>
          {error && !reports.length &&
            <ErrorMessage error={error} />
          }
          {!refreshing && !error && !reports.length &&
            <EmptyMessage icon='list' message='Nenhum relatório criado' />
          }
          {!!reports.length &&
            <View style={StyleSheet.flatten([theme.fabPadding])}>
              <ChurchReportListComponent
                reports={reports}
                onPressEdit={this.onPressEdit.bind(this)}
                onPressRemove={this.onPressRemove.bind(this)}
              />
            </View>
          }
        </Content>
        <Fab onPress={() => this.navigate('ChurchReportForm')}>
          <Icon name='md-add' />
        </Fab>
      </Container>
    );
  }
}
