// import './assets/css/index.less';
//
// window.onload = function(){
//   console.log('加载完毕');
//   console.log('执行后续操作')
//   console.log('执行后续操作2');
//   var btn = document.createElement("button");
//   var span = document.createElement("span");
//   span.innerHTML = 'SPAN';
//   btn.classList.add('btn');
//   btn.appendChild(span);
//   document.body.appendChild(btn);
// }

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('react-root'));
