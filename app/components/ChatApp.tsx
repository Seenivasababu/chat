'use client';
import React, { useState } from 'react';
import Login from './Login';

const ChatApp = () => {
  const [userName, setUserName] = useState<string | null>(null);

  const handleLogin = (userName:string)=> {
    setUserName(userName)
  }
  console.log(userName);
  
  return (
    <div className="flex justify-center items-center">
      {!userName && <Login onLogin={handleLogin}/>}
      {userName && <h2>Welcome to chat world</h2>}
    </div>
  );
};

export default ChatApp;
