import { Body, Button, Card, CardItem, Container, Content, Fab, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { RefreshControl, StyleSheet } from 'react-native';

import BaseComponent from '../../components/base';
import React from 'react';
import churchReportService from '../../services/churchReport';
import dateFormatter from '../../formatters/date';
import logService from '../../services/log';
import theme from '../../theme';

export default class ChurchReportListPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Relatório de Culto',
    drawerIcon: ({ tintColor }) => (
      <Icon name="list-box" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
    this.state = { refreshing: true, error: false, reports: [] };
  }

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  load(refresh = false) {
    this.setState({ refreshing: true }, true);

    this.subscription = churchReportService.list(refresh).subscribe(reports => {
      this.setState({ refreshing: false, error: false, reports: reports || [] });
    }, err => {
      this.setState({ refreshing: false, error: true });
      logService.handleError(err);
    });
  }

  render() {
    const { refreshing, reports, error } = this.state;

    return (
      <Container style={StyleSheet.flatten(theme.cardsContainer)}>
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
          {!refreshing && error &&
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Não conseguimos atualizar</Text>
            </View>
          }
          {!refreshing && !error && !reports.length &&
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Nenhum relatório criado</Text>
            </View>
          }
          {!refreshing && !error && !!reports.length &&
            <View style={StyleSheet.flatten([theme.cardsPadding, theme.fabPadding])}>
              {reports.map(report =>
                <Card key={report.id}>
                  <CardItem header>
                    <Left style={StyleSheet.flatten(styles.leftWrapper)}>
                      <View style={StyleSheet.flatten(styles.leftView)}>
                        <Text style={StyleSheet.flatten(styles.day)}>{dateFormatter.format(report.date, 'DD')}</Text>
                        <Text style={StyleSheet.flatten(styles.month)}>{dateFormatter.format(report.date, 'MMM')}</Text>
                      </View>
                    </Left>
                    <Body>
                      <Text>{report.title}</Text>
                      <Text note>{report.type.name}</Text>
                    </Body>
                    <Right style={StyleSheet.flatten(styles.rightWrapper)}>
                      <Button transparent dark onPress={() => this.navigate('ChurchReportForm', { report })}>
                        <Icon name="create" style={StyleSheet.flatten(styles.buttonIcon)} />
                      </Button>
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Grid>
                        <Col style={StyleSheet.flatten(styles.row)}>
                          <Text style={StyleSheet.flatten(styles.counter)}>{report.totalMembers}</Text>
                          <Text style={StyleSheet.flatten(styles.label)}>Memb.</Text>
                        </Col>
                        <Col style={StyleSheet.flatten(styles.row)}>
                          <Text style={StyleSheet.flatten(styles.counter)}>{report.totalNewVisitors}</Text>
                          <Text style={StyleSheet.flatten(styles.label)}>Visit.</Text>
                        </Col>
                        <Col style={StyleSheet.flatten(styles.row)}>
                          <Text style={StyleSheet.flatten(styles.counter)}>{report.totalFrequentVisitors}</Text>
                          <Text style={StyleSheet.flatten(styles.label)}>Freq.</Text>
                        </Col>
                        <Col style={StyleSheet.flatten(styles.row)}>
                          <Text style={StyleSheet.flatten(styles.counter)}>{report.totalKids}</Text>
                          <Text style={StyleSheet.flatten(styles.label)}>Crian.</Text>
                        </Col>
                        <Col style={StyleSheet.flatten(styles.row)}>
                          <Text style={StyleSheet.flatten(styles.counterTotal)}>{report.total}</Text>
                          <Text style={StyleSheet.flatten(styles.labelTotal)}>Total</Text>
                        </Col>
                      </Grid>
                    </Body>
                  </CardItem>
                </Card>
              )}
            </View>
          }
        </Content>
        <Fab onPress={() => this.navigate('ChurchReportForm')}>
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  leftWrapper: {
    maxWidth: 50,
    opacity: 0.5,
    flexDirection: 'column'
  },
  rightWrapper: {
    maxWidth: 50
  },
  leftView: {
    marginLeft: -5,
    marginTop: -2
  },
  day: {
    fontSize: 20,
    textAlign: 'center'
  },
  month: {
    marginTop: -5,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  counter: {
    fontSize: 20,
    opacity: 0.5
  },
  counterTotal: {
    fontSize: 20
  },
  label: {
    fontSize: 14,
    opacity: 0.5
  },
  labelTotal: {
    fontSize: 14
  },
  buttonIcon: {
    fontSize: 25
  }
});