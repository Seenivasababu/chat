import React, { useState } from 'react';

const Login = ({ onLogin }:any) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="card w-80 bg-slate-200/60">
      <div className="card-body">
        <input
          className="input input-bordered"
          placeholder="Enter your user name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="btn btn-neutral" onClick={handleLogin}> Log in</button>
      </div>
    </div>
  );
};

export default Login;
