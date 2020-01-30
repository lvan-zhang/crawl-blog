// import React from 'react';
// import { connect } from 'dva';
import styles from './IndexPage.css';

// function IndexPage() {
//   return (
//     <div className={styles.normal}>
//       <h1 className={styles.title}>Yay! Welcome to dva!</h1>
//       <div className={styles.welcome} />
//       <ul className={styles.list}>
//         <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
//         <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
//       </ul>
//     </div>
//   );
// }

// IndexPage.propTypes = {
// };

// export default connect()(IndexPage);

import request from '../utils/request';
import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Alert,
  Modal
} from 'antd';
// import './IndexPage.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        if (params.month) {
          const pData = {
            year: params.month.year(),
            month: params.month.get('month') + 1,
          };
          let newDate = pData.year + '/' + pData.month;
          params.month = newDate
        }
        request('http://localhost:3001/csdn', {
          method: 'POST',
          body: params
        }).then(res => {
          Modal.info({
            title: 'This is a notification message',
            content: (
              <div>
                爬取成功，去所选的文件夹看看吧
              </div>
            ),
            onOk() {},
          });
        })
        // this.props.onSubmit(pData);
        console.log('Received values of form: ', params);
      }
    });
  };

  handleChange = value => {
    console.log(`selected ${value}`);
  };

  monthChange = (date, dateString) => {
    console.log(date, dateString);
  }

  handleReset = () => {
    this.props.form.resetFields();
    // this.props.onSubmit();
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      // 全局调整label样式
      labelCol: {
        xs: { span: 14 },
        sm: { span: 8 },
      },
      // 全局调整输入框样式
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    // check和button的样式
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const blogType = [
      {
        name: 'CSDN',
        value: 'csdn'
      },
      {
        name: '博客园',
        value: 'bokeyuan'
      },
      {
        name: '掘金',
        value: 'juejin'
      },
    ]

    const selectBefore = (
      <Select defaultValue="https://blog.csdn.net/" style={{ width: 190 }}>
        <Option value="https://blog.csdn.net/">https://blog.csdn.net/</Option>
        {/* <Option value="Https://">abc</Option> */}
      </Select>
    );

    // const varsPrefixField = getFieldDecorator("month", {
    //   getValueFromEvent: e => e.target.value.toUpperCase()
    // });

    return (
      <div className={styles.body}>
        <h2 className={styles.h2}>爬博客小工具</h2>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="博客类型">
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: '请选择博客类型',
                },
              ],
              initialValue: 'csdn'
            })(
            <Select defaultValue="csdn" onChange={this.handleChange} placeholder="选择一个博客类型">
              {blogType.map(option => (
                <Option value={option.value} disabled={option.value !== 'csdn'}>{option.name}</Option>
                // <Option value={option.value}>{option.name}</Option>
              ))}
            </Select>
            )}
          </Form.Item>
          <Form.Item label="博客id">
            {getFieldDecorator('id', {
              rules: [
                {
                  required: true,
                  message: '请输入您的博客id',
                },
              ],
            })(<Input addonBefore={selectBefore} placeholder="weixin_43972437" defaultValue="weixin_43972437" />)}
          </Form.Item>
          <Form.Item label="要爬取的月份">
            {getFieldDecorator('month', {
              initialValue: moment()
            })(<MonthPicker style={{ width: 400 }} format="YYYY/MM" placeholder="如果不选择，默认爬取全部" />)}
          </Form.Item>
          <Form.Item label="cookie">
            {getFieldDecorator('cookie', {
              rules: [
                {
                  required: true,
                  message: '请输入您的cookie',
                },
              ],
            })(<TextArea rows={4} />)}
            <Alert message="登录状态，右键点击审查元素，点击network，随便找一个http请求，在response headers找cookie复制过来" type="info" />
          </Form.Item>
          <Form.Item label="爬取后存储的路径">
            {getFieldDecorator('path', {
              rules: [
                {
                  required: true,
                  message: '请输入您的路径',
                },
              ],
            })(<Input placeholder="/Users/zhangyu/web/csdn/" />)}
            <Alert message="这里必须从根路径开始拼写，例如：/Users/zhangyu/web/csdn/，如果 ~/web/csdn/ 则无效" type="info" />
          </Form.Item>
          <Form.Item label="加前缀">
            {getFieldDecorator('prefix')(<TextArea rows={4} placeholder="title: {{title}}" />)}
            <Alert message="如果添加变量则用{{}}括起来，目前支持的变量有：title，date，tags，categories，description" type="info" />
          </Form.Item>
          {/* <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
            })(
              <Checkbox>
                I have read the <a href="hehe">agreement</a>
              </Checkbox>,
            )}
          </Form.Item> */}
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              开始爬取
            </Button>
            <Button onClick={this.handleReset} className={styles.left}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const App = Form.create({ name: 'register' })(RegistrationForm);
// export default App
export default connect()(App);
