import { Body, Button, Container, Content, Form, Header, Icon, Left, List, Right, Spinner, Title, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { BaseComponent } from '../../components/base';
import EmptyMessage from '../../components/emptyMessage';
import { Field } from '../../components/field';
import { dateFormatter } from '../../formatters/date';
import toast from '../../providers/toast';
import services from '../../services';
import { ChurchReportValidator } from '../../validators/churchReport';

export default class ChurchReportFormPage extends BaseComponent {
  constructor(props: any) {
    super(props);

    this.churchReportValidator = new ChurchReportValidator();
    this.churchReportService = services.get('churchReportService');

    this.state = {
      loading: true,
      model: this.params.report || {
        title: `Culto de ${dateFormatter.format(new Date, 'dddd')}`,
        date: new Date
      },
      validation: {}
    };
  }

  componentDidMount() {
    this.churchReportService.types()
      .logError()
      .bindComponent(this)
      .subscribe(types => {
        this.setState({
          loading: false,
          types: [
            { value: null, display: 'Selecione...' },
            ...types.map(type => ({ value: type.id, display: type.name }))
          ]
        });
      }, () => this.setState({ loading: false, error: true }));
  }

  save() {
    this.churchReportValidator.validate(this.state.model)
      .do(({ model, errors }) => this.setState({ validation: errors, model, submitted: true }, true))
      .filter(({ valid }) => valid)
      .switchMap(({ model }) => this.churchReportService.save(model).loader())
      .logError()
      .bindComponent(this)
      .subscribe(() => {
        this.goBack();
      }, () => toast.genericError());
  }

  public render(): JSX.Element {
    const { model, validation, loading, error, types, submitted } = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{model.id > 0 ? 'Editar' : 'Criar'} Relatório</Title>
          </Body>
          <Right>
            {!loading && !error &&
              <Button transparent onPress={() => this.save()}>
                <Icon name="checkmark" />
              </Button>
            }
          </Right>
        </Header>
        <Content keyboardShouldPersistTaps="handled">
          {loading && <Spinner />}
          {!loading && error &&
            <EmptyMessage icon="sad" message="Não conseguimos carregar" />
          }
          {!loading && !error &&
            <View style={styles.container}>
              <Form>
                <List>

                  <Field
                    label="Descrição"
                    icon="paper"
                    ref="description"
                    model={model}
                    field="title"
                    next={() => this.refs.typeId}
                    errors={validation}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null)}
                  />
                  <Field
                    label="Tipo"
                    ref="typeId"
                    icon="empty"
                    model={model}
                    field="typeId"
                    next={() => this.refs.date}
                    type="dropdown"
                    options={types}
                    errors={validation}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null)}
                  />
                  <Field
                    label="Data"
                    icon="calendar"
                    ref="date"
                    model={model}
                    field="date"
                    next={() => this.refs.totalMembers}
                    type="date"
                    errors={validation}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null)}
                  />

                  <Field
                    label="Total de Membros"
                    icon="contacts"
                    ref="totalMembers"
                    model={model}
                    field="totalMembers"
                    next={() => this.refs.totalNewVisitors}
                    type="number"
                    errors={validation}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null)}
                  />
                  <Field
                    label="Total de Visitantes"
                    icon="empty"
                    ref="totalNewVisitors"
                    model={model}
                    field="totalNewVisitors"
                    next={() => this.refs.totalFrequentVisitors}
                    type="number"
                    errors={validation}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null)}
                  />
                  <Field
                    label="Total de Frequentadores"
                    icon="empty"
                    ref="totalFrequentVisitors"
                    model={model}
                    field="totalFrequentVisitors"
                    next={() => this.refs.totalKids}
                    type="number"
                    errors={validation}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null)}
                  />
                  <Field
                    label="Total de Crianças"
                    icon="empty"
                    ref="totalKids"
                    model={model}
                    field="totalKids"
                    type="number"
                    errors={validation}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null)}
                    onSubmit={() => this.save()}
                  />
                </List>
              </Form>
            </View>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingBottom: 30
  }
});