import React, { useState, useEffect } from 'react';
import './App.css';

const socket = require('socket.io-client')('http://127.0.0.1:4002');

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [nickName, setNickName] = useState('');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  const [list, setList] = useState([]);

  useEffect(() => {
    init();
  }, [list]);

  function handleChange(e) {
    setNickName(e.target.value);
  }

  function handleSubmit() {
    if (nickName !== '') {
      setIsLogin(true);
      socket.emit('login', {
        id: Date.now(),
        username: nickName
      });
    }
  }

  function handleLogout() {
    setIsLogin(false);
    socket.emit('logout', {
      username: nickName
    });
  }

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function init(){
    socket.on('login', function (data) {
      console.log(data.username + '登录了聊天室');
      setCount(data.count)
    });
  
    socket.on('logout', function (data) {
      console.log(data.username + '离开了聊天室');
      setCount(data.count)
    });
    socket.on('message', function (data) {
      setList(list.concat([{ nickName: data.username, message: data.message, isMe: false }]));
    });
  }
  

  function handleSend() {
    setList(list.concat([{ nickName, message, isMe: true }]));
    setMessage('');
    socket.emit('message', { nickName, message, isMe: true });
  }

  return (
    <div className="App">

      {
        isLogin ? (
          <>
            <header>
              Hdove Vip 黄金聊天室({`${count}`})
              <span style={{ float: 'right', cursor: 'pointer' }} onClick={handleLogout}>退出</span>
            </header>

            <section>
              <ul>
                {
                  list && list.length > 0 && list.map(item => {
                    return <li className={item.isMe ? 'right' : 'left'} key={item.nickName}>
                        <div className="logo">{[...item.nickName][0]}</div>
                        <span className="content">{item.message}</span>
                      </li>
                    
                  })
                }
              </ul>
            </section>

            <footer>
              <input type="text" onChange={handleMessageChange} value={message}/>
              <button onClick={handleSend}>发送</button>
            </footer></>
        ) : (
            <div className="login">
              <form action="" onSubmit={handleSubmit}>
                <span>请输入昵称：
              <input type="text" onChange={handleChange} value={nickName} />
                </span>
              </form>

            </div>
          )
      }

    </div>
  );
}

export default App;
