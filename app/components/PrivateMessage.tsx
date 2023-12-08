import React, { use } from 'react';
import { privateMessage } from './ChatApp';

const PrivateMessage = ({
  privateMessage,
  userName,
  selectedUser,
}: {
  privateMessage: privateMessage[];
  userName: string;
  selectedUser: string;
}) => {
   console.log(privateMessage);
   
  return (
    <>
      {privateMessage
        .filter(
          (message) =>
            (message.from === userName && message.to === selectedUser) ||
            (message.from === selectedUser && message.to === userName)
        )
        .map((message: privateMessage, index: number) => {
          return (
            <div
              className={`chat ${
                message.from === userName ? 'chat-end' : 'chat-start'
              }`}
              key={index}
            >
              <div className="chat-header mr-2">
                {userName !== selectedUser ?  message.from :message.to }
                <time className="text-xs opacity-50 ml-1">{message.time}</time>
              </div>
              <div className="chat-bubble">{message.data}</div>
            </div>
          );
        })}
    </>
  );
};

export default PrivateMessage;
