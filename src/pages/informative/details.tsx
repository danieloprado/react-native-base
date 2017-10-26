import { Body, Button, Container, Content, Header, Icon, Left, Right, Spinner, Title, View } from 'native-base';
import * as React from 'react';
import { Share, WebView } from 'react-native';

import { BaseComponent } from '../../components/base';
import EmptyMessage from '../../components/emptyMessage';
import informativeRender from '../../formatters/informativeRender';
import * as services from '../../services';
import { enInformativeType } from '../../services/enums/informativeType';

export default class InformativeDetailsPage extends BaseComponent {
  constructor(props: any) {
    super(props);

    this.informativeService = services.get('informativeService');
    const { informative } = this.params;

    this.state = {
      loading: informative ? false : true,
      informative: informative,
      html: informative ? informativeRender(informative) : null
    };
  }

  componentDidMount() {
    if (this.state.informative) return;

    this.informativeService.get(this.params.id)
      .logError()
      .bindComponent(this)
      .subscribe(informative => {
        const html = informative ? informativeRender(informative) : null;
        this.setState({ loading: false, informative, html, error: !informative });
      }, () => this.setState({ loading: false, error: true }));
  }

  share() {
    Share.share({
      title: this.state.informative.title,
      message: this.state.text
    });
  }

  setText(text) {
    this.state.text = text;
    this.setState(this.state);
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
            <Button transparent onPress={() => this.goBack()}>
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
            <EmptyMessage icon="sad" message="Não conseguimos atualizar" />
          </Content>
        }
        {!loading && !error &&
          <View style={{ flex: 1 }}>
            <WebView
              source={{ html }}
              onMessage={event => this.setText(event.nativeEvent.data)}
              style={{ flex: 1 }} />
          </View>
        }
      </Container>
    );
  }
}