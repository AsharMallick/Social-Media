import React, { useState, useEffect } from 'react'
import './Login.css'
import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { loginUser } from '../../Actions/User'
import { useAlert } from 'react-alert'

const Login = () => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { message: userMessage, error } = useSelector(state => state.user)
    const alert = useAlert()
    const loginHandler = async (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password))
        setEmail("")
        setPassword("")
    }
    useEffect(() => {
        if (userMessage) {
            alert.success(userMessage)
            dispatch({type:'clearMessages'})
        }
         if (error) {
            console.log(error)
             alert.error(error);
             dispatch({type:'clearErrors'})

         }
    }, [userMessage, dispatch, alert, error])
    
    return (
        <div className='login'>
            <form className="loginForm" onSubmit={loginHandler}>
                <Typography variant='h3' style={{ padding: "2vmax" }}>Social Aap</Typography>
                <input type="email" placeholder='Email' required minLength={3} value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder='Password' required minLength={3} value={password} onChange={e => setPassword(e.target.value)} />
                <Link to='/forgot/password'>
                    <Typography>Forgot Password?</Typography>
                </Link>
                <Button type='submit'>Submit</Button>
                <Link to='/register'>
                    <Typography>New User?</Typography>
                </Link>
            </form>
        </div>
    )
}

export default Login;