import React from 'react';
import socketHandler from '../router/socket';

function ChatList(props) {
  const { send, answer, socket } = props;

  onclick = (e) => {
    const selectBtnName = { input: send, step: 2, option: e.target.value };
    socketHandler.recvMessage(socket, selectBtnName);
  };

  return (
    <div className="chat-container">
      <div className="leftChat">
        {send}
        {send ? (
          <div className="leftChatBtn-container">
            <input
              className="leftChat-button"
              type="button"
              value="가격순"
              onclick={onclick}
            ></input>
            <input
              className="leftChat-button"
              type="button"
              value="리뷰순"
              onclick={onclick}
            ></input>
            <input
              className="leftChat-button"
              type="button"
              value="할인율"
              onclick={onclick}
            ></input>
            <input
              className="leftChat-button"
              type="button"
              value="평점순"
              onclick={onclick}
            ></input>
          </div>
        ) : (
          ''
        )}
      </div>

      <div className="rightChat">
        {answer
          ? answer.map((i, index) => {
              return <div>{i.title}</div>;
            })
          : ''}
      </div>
    </div>
  );
}

export default React.memo(ChatList);
