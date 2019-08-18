import React, { Component } from 'react';
import { DatePicker, List } from 'antd-mobile';
import '../assets/css/index.less';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      date: new Date(),
    };
  }
  render(){
    let user = {name: '张三', id: '0x151515564'};
    let { name, id } = user;
    return (
      <div className="app">
        <h1>Index!</h1>
        <img style={{width: '100px'}} src={require('../assets/img/icon-square-big.svg')} />
        <div>
          <button className="btn">
            <span>{name} - {id}</span>
          </button>
        </div>
        <div>
          <video width="320" height="240" controls>
            <source src={require('@/assets/media/movie.mp4')}  type="video/mp4" />
            您的浏览器不支持 HTML5 video 标签。
          </video>
        </div>
        <DatePicker value={this.state.date} onChange={date => this.setState({ date })}>
          <List.Item arrow="horizontal">Datetime</List.Item>
        </DatePicker>
      </div>
    );
  }
};
