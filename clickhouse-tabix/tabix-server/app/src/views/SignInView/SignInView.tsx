import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Flex } from 'reflexy';
import { Button, Layout, Typography, Tabs, Row, Col, Divider, Timeline, Badge } from 'antd';
import { observer } from 'mobx-react';
import { typedInject } from 'module/mobx-utils';
import { SignInStore, Stores } from 'stores';
import { Connection, ConnectionLike, ConnectionType, isDirectConnection } from 'services';
import { ConnectionModel, DirectConnectionModel } from 'models';
import Page from 'components/Page';
import Splitter from 'components/Splitter';
import { ConnectionList, DirectSignInForm } from 'components/SignIn';
import {
  SmileOutlined,
  StarOutlined,
  FontSizeOutlined,
  GithubOutlined,
  TwitterOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import css from './SignInView.css';
import { observable } from 'mobx';

interface InjectedProps {
  store: SignInStore;
}

export type Props = InjectedProps;
// const { Title, Paragraph, Text, Link } = Typography;
type RoutedProps = Props & RouteComponentProps<any>;

@observer
class SignInView extends React.Component<RoutedProps> {
  componentDidMount() {
    const { store } = this.props;
    // i`m
    // if (!this.imCheck) {
    //   this.imCheck = true;
    //   //
    //   this.checkVersionUpdateTabix();
    // }
    store.loadConnections();
  }

  private onSelectConnection = (connection: Connection) => {
    const { store } = this.props;
    store.setSelectedConnection(connection);
  };

  private onChangeTab = (key: string) => {
    const con =
      key === ConnectionType.Direct ? ConnectionModel.DirectEmpty : ConnectionModel.ServerEmpty;
    const { store } = this.props;
    store.setSelectedConnection(con);
  };

  private signIn = () => {
    const { store, history } = this.props;

    store.signIn(history);
  };

  renderFooter() {
    const { store } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        Tabix ©{new Date().getFullYear()} Version: {store.getCurrentVersionTabix()}&nbsp;
        {store.tbxUpdate.needUpdate ? (
          <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />}>
            ,
            <a target="_blank" href={store.tbxUpdate.link} rel="noreferrer">
              Update new version {store.tbxUpdate.newVersion}
            </a>
          </Badge>
        ) : (
          ' 技术支持 @rangobai'
        )}
      </div>
    );
  }

  @observable
  private onFinishForm = (values: ConnectionLike): void => {
    const { selectedConnection } = this.props.store;

    // validate url
    const u = new URL(values.connectionUrl);

    console.log(`Connect to: ${u.host} : ${u.port} , ${u.protocol}`);

    // -----------------------------------
    // Fackig mobx drop naxui
    // Update data
    // @ts-ignore
    selectedConnection.changeField({ name: 'connectionName', value: values['connectionName'] });
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'connectionName') selectedConnection.setField(key, value);
    });
    this.signIn();
  };

  render() {
    const { store } = this.props;
    //pass:checkVersionUpdateTabix123
    return (
      <Page column={false} uiStore={store.uiStore}>
        <Splitter>
          <Flex alignItems="stretch" className={css['layout-connection-list']} vfill>
            <Layout>
              <Layout.Sider width="100%">
                <Row
                  style={{ minHeight: '150px', marginTop: '10px' }}
                  align="middle"
                  justify="center"
                >
                  <a href="https://tabix.io/" target="_blank" rel="noreferrer">
                    <img
                      className={css.logoimg}
                      src="http://unimap-branch-db-1251316161.cos.ap-beijing.myqcloud.com/map.png"
                      alt="Tabix LOGO"
                    />
                  </a>
                  <Divider />
                </Row>

                <Row style={{ paddingLeft: '20px' }}>选择或者创建:</Row>
                <Divider />
                <ConnectionList
                  selectedConnection={store.selectedConnection}
                  connections={store.connectionList}
                  onSelect={this.onSelectConnection}
                />
                <Divider />
                <Flex center>
                  <Button
                    type="primary"
                    style={{ float: 'left' }}
                    className={css['add-connection-btn']}
                    onClick={store.addNewConnection}
                  >
                    添加连接
                  </Button>
                </Flex>
              </Layout.Sider>
            </Layout>
          </Flex>

          <Flex shrink={false} center fill>
            <Flex column>
              <Col>
                <Row>
                  <Tabs
                    type="line"
                    activeKey={
                      isDirectConnection(store.selectedConnection)
                        ? ConnectionType.Direct
                        : ConnectionType.Server
                    }
                    onChange={this.onChangeTab}
                    className={css.form}
                  >
                    <Tabs.TabPane
                      tab="DIRECT CH"
                      key={ConnectionType.Direct}
                      style={{ minWidth: '490px' }}
                    >
                      {isDirectConnection(store.selectedConnection) && (
                        <DirectSignInForm
                          model={store.selectedConnection}
                          onDelete={store.deleteSelectedConnection}
                          onSignIn={this.signIn}
                          onFinish={this.onFinishForm}
                          deleteEnabled={!!store.selectedConnection.connectionName}
                        />
                      )}
                    </Tabs.TabPane>
                    {/*<Tabs.TabPane tab="TABIX.SERVER" key={ConnectionType.Server}>*/}
                    {/*  {!isDirectConnection(store.selectedConnection) && (*/}
                    {/*    <ServerSignInForm*/}
                    {/*      model={store.selectedConnection}*/}
                    {/*      onDelete={store.deleteSelectedConnection}*/}
                    {/*      onSignIn={this.signIn}*/}
                    {/*      deleteEnabled={!!store.selectedConnection.connectionName}*/}
                    {/*    />*/}
                    {/*  )}*/}
                    {/*</Tabs.TabPane>*/}
                  </Tabs>
                </Row>
                <Row>
                  <Divider />
                  {this.renderFooter()}
                </Row>
              </Col>
            </Flex>
          </Flex>
        </Splitter>
      </Page>
    );
  }
}

export default withRouter(
  typedInject<InjectedProps, RoutedProps, Stores>(({ store }) => ({ store: store.signInStore }))(
    SignInView
  )
);
