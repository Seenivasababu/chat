import React from 'react';
import { message } from './ChatApp';

const PublicMessage = ({ publicMessage,userName }: { publicMessage: message[],userName:string }) => {
  return (
    <>
      {publicMessage.map((message: message, index: number) => {
        return (
          <div
            className={`chat ${
              message.userName === userName ? 'chat-end' : 'chat-start'
            }`}
            key={index}
          >
            <div className="chat-header mr-2">
              {message.userName}
              <time className="text-xs opacity-50 ml-1">{message.time}</time>
            </div>
            <div className="chat-bubble">{message.message}</div>
          </div>
        );
      })}
    </>
  );
};

export default PublicMessage;
