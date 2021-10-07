import React from 'react';

function ChatList(props) {
  const { chat, answer } = props;
  return (
    <div className="chat-container">
      <div className="leftChat">
        {chat}
        {chat ? (
          <div className="leftChatBtn-container">
            <input className="leftChat-button" type="button" value="가격순"></input>
            <input className="leftChat-button" type="button" value="리뷰순"></input>
            <input className="leftChat-button" type="button" value="할인율"></input>
            <input className="leftChat-button" type="button" value="평점순"></input>
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
        {/* <div>{answer}</div> */}
      </div>
    </div>
  );
}

export default React.memo(ChatList);
