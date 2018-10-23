import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Input, Icon, message, Radio } from 'antd';
import { loginActions, loginLdapActions, loginGitLabActions } from '../../reducer/modules/user';
import { withRouter } from 'react-router';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import './Login.scss';

const formItemStyle = {
  marginBottom: '.16rem'
};

const changeHeight = {
  height: '.42rem'
};

@connect(
  state => {
    return {
      loginData: state.user,
      loginTitle: state.user.loginTitle,
      isGitLab: state.user.isGitLab,
      isLDAP: state.user.isLDAP
    };
  },
  {
    loginGitLabActions,
    loginActions,
    loginLdapActions
  }
)
@withRouter
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginType: 'gitlab'
    };
  }

  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    loginActions: PropTypes.func,
    loginLdapActions: PropTypes.func,
    loginGitLabActions: PropTypes.func,
    loginTitle: PropTypes.any,
    isGitLab: PropTypes.bool,
    isLDAP: PropTypes.bool
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = this.props.form;

    console.log("授权！", this.state.loginType);
    form.validateFields((err, values) => {
      if (!err) {
        if (this.props.isLDAP && this.state.loginType === 'ldap') {
          console.log("LDAP授权！");
          this.props.loginLdapActions(values).then(res => {
            if (res.payload.data.errcode == 0) {
              this.props.history.replace('/group');
              message.success('登录成功! ');
            }
          });
        } else if (this.props.isGitLab && this.state.loginType === 'gitlab') { 
          console.log("GitLab授权！");
          this.props.loginGitLabActions(values).then(res => {
            if (res.payload.data.errcode == 0) {
              this.props.history.replace('/group');
              message.success('登录成功! ');
            }
          });
        } else {
          console.log("授权普通！");
          this.props.loginActions(values).then(res => {
            if (res.payload.data.errcode == 0) {
              this.props.history.replace('/group');
              message.success('登录成功! ');
            }
          });
        }
      }
    });
  };

  componentDidMount() {
    //Qsso.attach('qsso-login','/api/user/login_by_token')
    console.log('isLDAP', this.props.isLDAP);
    console.log('isGitLab', this.props.isGitLab);
    console.log('login title', this.props.loginTitle);
  }
  handleFormLayoutChange = e => {
    this.setState({ loginType: e.target.value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLDAP } = this.props;
    const { isGitLab } = this.props;
    const { loginTitle } = this.props.loginTitle;

    console.log("props:", this.props);
    console.log("isLDAP:", isLDAP);
    console.log("isGitLab:", isGitLab);
    console.log("login title::", loginTitle);

    const emailRule =
      this.state.loginType === 'ldap'
        ? {}
        : {
            required: true,
            message: '请输入正确的email!',
            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,})+$/
          };
    return (
      <Form onSubmit={this.handleSubmit}>
        {/* 登录类型 (普通登录／LDAP登录) */}
        {isLDAP && isGitLab && (
          <FormItem>
            <RadioGroup defaultValue="gitlab" onChange={this.handleFormLayoutChange}>
              <Radio value="gitlab">GitLab</Radio>
              <Radio value="ldap">LDAP</Radio>
              <Radio value="normal">普通登录</Radio>
            </RadioGroup>
          </FormItem>
        )}

        {isLDAP && !isGitLab && (
          <FormItem>
            <RadioGroup defaultValue="gitlab" onChange={this.handleFormLayoutChange}>
              <Radio value="ldap">LDAP</Radio>
              <Radio value="normal">普通登录</Radio>
            </RadioGroup>
          </FormItem>
        )}

        {!isLDAP && isGitLab && (
          <FormItem>
            <RadioGroup defaultValue="gitlab" onChange={this.handleFormLayoutChange}>
              <Radio value="gitlab">GitLab</Radio>
              <Radio value="normal">普通登录</Radio>
            </RadioGroup>
          </FormItem>
        )}

        {/* 用户名 (Email) */}
        <FormItem style={formItemStyle}>
          {getFieldDecorator('email', { rules: [emailRule] })(
            <Input
              style={changeHeight}
              prefix={<Icon type="user" style={{ fontSize: 13 }} />}
              placeholder="Email"
            />
          )}
        </FormItem>

        {/* 密码 */}
        <FormItem style={formItemStyle}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }]
          })(
            <Input
              style={changeHeight}
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>

        {/* 登录按钮 */}
        <FormItem style={formItemStyle}>
          <Button
            style={changeHeight}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </FormItem>

        {/* <div className="qsso-breakline">
          <span className="qsso-breakword">或</span>
        </div>
        <Button style={changeHeight} id="qsso-login" type="primary" className="login-form-button" size="large" ghost>QSSO登录</Button> */}
      </Form>
    );
  }
}
const LoginForm = Form.create()(Login);
export default LoginForm;
