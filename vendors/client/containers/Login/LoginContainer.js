import React, { PureComponent as Component } from 'react';
import Login from './LoginWrap';
import { Row, Col, Card } from 'antd';
import LogoSVG from '../../components/LogoSVG/index.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

@connect(state => ({
  loginData: state.user,
  loginTitle: state.user.loginTitle,
  isGitLab: state.user.isGitLab,
  isLDAP: state.user.isLDAP
}))

class LoginContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    loginTitle: PropTypes.any,
    isGitLab: PropTypes.bool,
    isLDAP: PropTypes.bool
  };

  render() {
    var loginTitle = this.props.loginTitle;

    return (
      <div className="g-body login-body">
        <div className="m-bg">
          <div className="m-bg-mask m-bg-mask0" />
          <div className="m-bg-mask m-bg-mask1" />
          <div className="m-bg-mask m-bg-mask2" />
          <div className="m-bg-mask m-bg-mask3" />
        </div>
        <div className="main-one login-container">
          <div className="container">
            <Row type="flex" justify="center">
              <Col xs={20} sm={16} md={12} lg={8} className="container-login">
                <Card className="card-login">
                  <h2 className="login-title">{loginTitle}</h2>
                  <div className="login-logo">
                    <LogoSVG length="100px" />
                  </div>
                  <Login />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }   
}

export default LoginContainer;
