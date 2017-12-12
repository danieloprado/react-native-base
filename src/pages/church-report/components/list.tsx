import { Body, ListItem, Text, View } from 'native-base';
import * as propTypes from 'prop-types';
import * as React from 'react';
import { ListView, StyleSheet } from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';

import { PopupMenu } from '../../../components/popupMenu';
import { dateFormatter } from '../../../formatters/date';
import { IChurchReport } from '../../../interfaces/churchReport';

interface IProps {
  reports: IChurchReport[];
  onPressEdit(report: IChurchReport): void;
  onPressRemove(report: IChurchReport, index: number): void;
}

export function ChurchReportListComponent(props: IProps): JSX.Element {
  const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const { reports, onPressEdit, onPressRemove } = props;

  return (
    <ListView
      removeClippedSubviews={false}
      initialListSize={10}
      enableEmptySections={true}
      dataSource={dataSource.cloneWithRows(reports)}
      renderRow={(report: IChurchReport, sectionId: number, index: number) =>
        <ListItem key={report.id} avatar button style={styles.listItem}>
          <Body style={styles.body}>
            <Grid>
              <Row>
                <Col style={styles.leftWrapper}>
                  <View style={styles.leftView}>
                    <Text style={styles.day}>{dateFormatter.format(report.date, 'DD')}</Text>
                    <Text style={styles.month}>{dateFormatter.format(report.date, 'MMM')}</Text>
                  </View>
                </Col>
                <Col>
                  <Text>{report.title}</Text>
                  <Text note>{report.type.name}</Text>
                </Col>
                <Col style={styles.rightWrapper}>
                  <PopupMenu
                    transparent dark
                    actions={[{
                      display: 'Editar',
                      onPress: () => onPressEdit(report)
                    }, {
                      display: 'Excluir',
                      onPress: () => onPressRemove(report, index)
                    }]}
                  />
                </Col>
              </Row>
              <Row style={styles.counterRow}>
                <Col style={styles.col}>
                  <Text style={styles.counter}>{report.totalMembers}</Text>
                  <Text style={styles.label}>Memb.</Text>
                </Col>
                <Col style={styles.col}>
                  <Text style={styles.counter}>{report.totalNewVisitors}</Text>
                  <Text style={styles.label}>Visit.</Text>
                </Col>
                <Col style={styles.col}>
                  <Text style={styles.counter}>{report.totalFrequentVisitors}</Text>
                  <Text style={styles.label}>Freq.</Text>
                </Col>
                <Col style={styles.col}>
                  <Text style={styles.counter}>{report.totalKids}</Text>
                  <Text style={styles.label}>Crian.</Text>
                </Col>
                <Col style={styles.col}>
                  <Text style={styles.counterTotal}>{report.total}</Text>
                  <Text style={styles.labelTotal}>Total</Text>
                </Col>
              </Row>
            </Grid>
          </Body>
        </ListItem>
      } />
  );
}

(ChurchReportListComponent as any).propTypes = {
  reports: propTypes.array.isRequired,
  onPressEdit: propTypes.func.isRequired
};

const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0,
    paddingLeft: 0
  },
  body: {
    marginLeft: 0,
    paddingLeft: 10
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
  counterRow: {
    marginTop: 20
  },
  col: {
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