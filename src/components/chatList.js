import React from 'react';

function ChatList(props) {
  const { leftChat, rightChat, chat, answer } = props;
  return (
    <div>
      <div className={leftChat}>{chat}</div>
      <div className={rightChat}>
        <div>{answer}</div>
      </div>
    </div>
  );
}

export default React.memo(ChatList);
