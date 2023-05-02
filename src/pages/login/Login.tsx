import React, { useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom'


import { AuthContext } from '../../context/authContext'
import MasterPanelService from '../../service/MasterPanelService';


const SignIn: React.FunctionComponent<{}> = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const [error, setError] = useState('')


  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const signInClicked = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await authContext.signInWithEmail(username, password);
      MasterPanelService.getTransactions();
      navigate('/');
    } catch (err: any) {
        setError(err.message);
    }
  }

  const passwordResetClicked = async () => {
    navigate('requestcode')
  }

  return (
    <form onSubmit={signInClicked}>
    <label>
      Username:
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
    </label>
    <label>
      Password:
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </label>
    <button type="submit">Login</button>
  </form>
  )
}

export default SignIn