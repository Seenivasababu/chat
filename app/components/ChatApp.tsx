'use client';
import React, { useEffect, useState } from 'react';
import Login from './Login';
import { io } from 'socket.io-client';
import Link from 'next/link';
import { DateTime } from 'next-auth/providers/kakao';

const socket = io('http://localhost:4000');


type message = {
  message: string;
  userName: string;
  time : DateTime
};
const ChatApp = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [usersList, setUsersList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [publicMessage, setPublicMessage] = useState<message[]>([]);

  useEffect(() => {
    socket.on('usersList', (usersList) => {
      setUsersList(usersList);
    });
    socket.on('publicHistory', (messages) => {
      setPublicMessage(messages);
    });
    socket.on('publicMessage', (message: message) => {
      setPublicMessage((prev) => [...prev, message]);
    });

    return () => {
      socket.off('usersList');
      socket.off('publicMessage');
      socket.off('publicHistory');
    };
  }, []);

  const handleLogin = (userName: string) => {
    setUserName(userName);
    socket.emit('authenticate', userName);
  };

  const sendMessage = () => {
    socket.emit('publicMessage', inputMessage);
    setInputMessage("")
  };

  return (
    <div className="">
      {!userName && <Login onLogin={handleLogin} />}
      {userName && (
        <>
          <div className="grid grid-cols-4 h-screen bg-slate-200">
            <div className="col-span-1 border-r-2 border-gray-400">
              <h2 className="text-2xl p-2">Connected Client - {userName}</h2>
              <div className=" flex flex-col">
                {usersList.map((user) => {
                  return (
                    <Link
                      key={user}
                      href={'/'}
                      className="p-2 hover:bg-slate-300"
                    >
                      {user}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="col-span-3 w-full">
              <div className="flex flex-col-reverse h-screen">
                <div className="flex">
                  <input
                    className="input input-bordered mb-8 ml-4 mr-4 flex-grow"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button
                    className="btn btn-success mr-4"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>

                <div className="bg-slate-300 ml-4 mb-2 flex-grow mr-4 overflow-auto">
                  {publicMessage.map((message, index) => {
                    return (
                      <div
                        className={`chat ${
                          message.userName === userName
                            ? 'chat-end'
                            : 'chat-start'
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
                </div>
                <div className="bg-slate-400 ml-4 p-2 mr-4">Public Message</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatApp;
