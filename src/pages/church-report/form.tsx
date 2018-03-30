import { Body, Button, Container, Content, Form, Header, Icon, Left, List, Right, Spinner, Title, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { dateFormatter } from '../../formatters/date';
import { IChurchReport } from '../../interfaces/churchReport';
import { ISelectItem } from '../../interfaces/selectItem';
import { toastError } from '../../providers/toast';
import churchReportService from '../../services/churchReport';
import FormComponent, { IStateForm } from '../../shared/abstract/formComponent';
import { ErrorMessage } from '../../shared/errorMessage';
import { Field } from '../../shared/field';
import { ChurchReportValidator } from '../../validators/churchReport';

interface IState extends IStateForm<IChurchReport> {
  loading: boolean;
  submitted: boolean;
  types?: ISelectItem<number>[];
  error?: any;
}

export default class ChurchReportFormPage extends FormComponent<IState> {
  private churchReportValidator: ChurchReportValidator;

  constructor(props: any) {
    super(props);

    this.churchReportValidator = new ChurchReportValidator();

    this.state = {
      loading: true,
      submitted: false,
      validation: {},
      model: this.params.report || {
        title: `Culto de ${dateFormatter.format(new Date, 'dddd')}`,
        date: new Date
      }
    };
  }

  public componentDidMount(): void {
    churchReportService.types()
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
      }, error => this.setState({ loading: false, error }));
  }

  public save(): void {
    this.churchReportValidator.validate(this.state.model)
      .do(({ model, errors }) => this.setState({ validation: errors, model, submitted: true }, true))
      .filter(({ valid }) => valid)
      .switchMap(({ model }) => churchReportService.save(model).loader())
      .logError()
      .bindComponent(this)
      .subscribe(() => {
        this.goBack();
      }, err => toastError(err));
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
                <Icon name='md-checkmark' />
              </Button>
            }
          </Right>
        </Header>
        <Content keyboardShouldPersistTaps='handled'>
          {loading && <Spinner />}
          {!loading && error &&
            <ErrorMessage error={error} />
          }
          {!loading && !error &&
            <View style={styles.container}>
              <Form>
                <List>

                  <Field
                    label='Descrição'
                    icon='paper'
                    ref='title'
                    type='text'
                    value={model.title}
                    error={validation.title}
                    next={() => this.refs.typeId}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null, 'title')}
                  />
                  <Field
                    label='Tipo'
                    ref='typeId'
                    icon='empty'
                    type='dropdown'
                    options={types}
                    value={model.typeId}
                    error={validation.typeId}
                    next={() => this.refs.date}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null, 'typeId')}
                  />
                  <Field
                    label='Data'
                    icon='calendar'
                    ref='date'
                    type='date'
                    value={model.date}
                    error={validation.date}
                    next={() => this.refs.totalMembers}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null, 'date')}
                  />

                  <Field
                    label='Total de Membros'
                    icon='contacts'
                    ref='totalMembers'
                    type='number'
                    value={model.totalMembers}
                    error={validation.totalMembers}
                    next={() => this.refs.totalNewVisitors}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null, 'totalMembers')}
                  />
                  <Field
                    label='Total de Visitantes'
                    icon='empty'
                    ref='totalNewVisitors'
                    type='number'
                    value={model.totalNewVisitors}
                    error={validation.totalNewVisitors}
                    next={() => this.refs.totalFrequentVisitors}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null, 'totalNewVisitors')}
                  />
                  <Field
                    label='Total de Frequentadores'
                    icon='empty'
                    ref='totalFrequentVisitors'
                    type='number'
                    value={model.totalFrequentVisitors}
                    error={validation.totalFrequentVisitors}
                    next={() => this.refs.totalKids}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null, 'totalFrequentVisitors')}
                  />
                  <Field
                    label='Total de Crianças'
                    icon='empty'
                    ref='totalKids'
                    type='number'
                    value={model.totalKids}
                    error={validation.totalKids}
                    onChange={this.updateModel.bind(this, submitted ? this.churchReportValidator : null, 'totalKids')}
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