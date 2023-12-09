'use client';
import React, { useEffect, useState } from 'react';
import Login from './Login';
import { io } from 'socket.io-client';
import Link from 'next/link';
import { DateTime } from 'next-auth/providers/kakao';
import PublicMessage from './PublicMessage';
import PrivateMessage from './PrivateMessage';

const socket = io('http://localhost:4000');

export type message = {
  message: string;
  userName: string;
  time: DateTime;
};
export type privateMessage = {
  data: string;
  from: string;
  to: string;
  time: DateTime;
};
const ChatApp = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [usersList, setUsersList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [publicMessage, setPublicMessage] = useState<message[]>([]);
  const [privateMessage, setPrivateMessage] = useState<privateMessage[]>([]);

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
    socket.on('privateMessage', (message: privateMessage) => {
      console.log('Response received');
      setPrivateMessage((prev) => [...prev, message]);
      console.log(privateMessage);
    });

    return () => {
      socket.off('usersList');
      socket.off('publicMessage');
      socket.off('publicHistory');
      socket.off('privateMessage');
    };
  }, []);

  const handleLogin = (userName: string) => {
    setUserName(userName);
    socket.emit('authenticate', userName);
  };

  const sendMessage = () => {
    socket.emit('publicMessage', inputMessage);
    setInputMessage('');
  };

  const sendPrivateMessage = () => {
    console.log('Request came');
    
    socket.emit('privateMessage', { to: selectedUser, message: inputMessage });
    setInputMessage('');
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
                      onClick={() => setSelectedUser(user)}
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        console.log(selectedUser);
                        
                        selectedUser ? sendPrivateMessage() : sendMessage();
                      }
                    }}
                  />
                  <button
                    className="btn btn-success mr-4"
                    onClick={selectedUser ? sendPrivateMessage : sendMessage}
                  >
                    Send
                  </button>
                </div>

                <div className="bg-slate-300 ml-4 mb-2 flex-grow mr-4 overflow-auto">
                  {selectedUser ? (
                    <PrivateMessage
                      privateMessage={privateMessage}
                      userName={userName}
                      selectedUser={selectedUser}
                    />
                  ) : (
                    <PublicMessage
                      publicMessage={publicMessage}
                      userName={userName}
                    />
                  )}
                </div>
                <div className="bg-slate-400 ml-4 p-2 mr-4">
                  {selectedUser
                    ? `Private message with ${selectedUser}`
                    : 'Public Message'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatApp;
