import React from 'react';

function ChatList(props) {
  const { leftChat, rightChat, chat, answer } = props;
  return (
    <div>
      <div className={leftChat}>{chat}</div>
      <div className={rightChat}>
        {answer.map((i, index) => {
          return <div>{i.title}</div>;
        })}
        {/* <div>{answer}</div> */}
      </div>
    </div>
  );
}

export default React.memo(ChatList);
