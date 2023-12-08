'use client';
import React, { useEffect, useState } from 'react';
import Login from './Login';
import { io } from 'socket.io-client';
import Link from 'next/link';

const socket = io('http://localhost:4000');

const ChatApp = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    socket.on('usersList', (usersList) => {
      setUsersList(usersList);
    });
  }, []);

  const handleLogin = (userName: string) => {
    setUserName(userName);
    socket.emit('authenticate', userName);
  };
  console.log(userName);

  return (
    <div className="">
      {!userName && <Login onLogin={handleLogin} />}
      {userName && (
        <>
          <div className="grid grid-cols-4 h-screen bg-slate-200">
            <div className="col-span-1 border-r-2 border-gray-400">
              <h2 className='text-2xl p-2'>Connected Client</h2>
              <div className=" flex flex-col">
                {usersList.map((user) => {
                  return (
                    <Link key={user} href={'/'} className="p-2 hover:bg-slate-300">
                      {user}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="col-span-3">
              <h2>Public Chat</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatApp;
