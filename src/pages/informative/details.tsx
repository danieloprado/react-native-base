import { Body, Button, Container, Content, Header, Icon, Left, Right, Spinner, Title, View } from 'native-base';
import * as React from 'react';
import { Share, WebView } from 'react-native';

import { informativeRender } from '../../formatters/informativeRender';
import { enInformativeType } from '../../interfaces/enums/informativeType';
import { IInformative } from '../../interfaces/informative';
import informativeService from '../../services/informative';
import BaseComponent from '../../shared/abstract/baseComponent';
import { EmptyMessage } from '../../shared/emptyMessage';
import { ErrorMessage } from '../../shared/errorMessage';

interface IState {
  loading: boolean;
  informative?: IInformative;
  html: string;
  error?: any;
}

export default class InformativeDetailsPage extends BaseComponent<IState> {
  constructor(props: any) {
    super(props);
    const { informative } = this.params;

    this.state = {
      loading: informative ? false : true,
      informative,
      html: informative ? informativeRender(informative) : null
    };
  }

  public componentDidMount(): void {
    if (this.state.informative) return;

    informativeService.get(this.params.id)
      .logError()
      .bindComponent(this)
      .subscribe(informative => {
        const html = informative ? informativeRender(informative) : null;
        this.setState({ loading: false, informative, html });
      }, error => this.setState({ loading: false, error }));
  }

  public share(): void {
    const { informative } = this.state;

    Share.share({
      title: informative.title,
      message: `Acompanhe o informativo: \n${informative.url}`
    });
  }

  public render(): JSX.Element {
    const { loading, html, informative, error } = this.state;
    let title = 'Informativo';

    if (informative) {
      title = informative.typeId === enInformativeType.cell ? 'Célula' : 'Igreja';
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.navigateBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right>
            {informative &&
              <Button transparent onPress={() => this.share()}>
                <Icon name='share' />
              </Button>
            }
          </Right>
        </Header>
        {loading &&
          <Content>
            <Spinner />
          </Content>
        }
        {!loading && error &&
          <Content>
            <ErrorMessage error={error} />
          </Content>
        }
        {!loading && !error && !informative &&
          <Content>
            <EmptyMessage icon='sad' message='Não encontramos' />
          </Content>
        }
        {!loading && !error && !!informative &&
          <View style={{ flex: 1 }}>
            <WebView
              source={{ html, baseUrl: '' }}
              style={{ flex: 1 }} />
          </View>
        }
      </Container>
    );
  }
}