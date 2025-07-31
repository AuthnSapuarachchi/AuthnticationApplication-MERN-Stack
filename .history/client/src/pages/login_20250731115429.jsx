import React,  from 'react'

const Login = () => {
  const [state, setState] = React.useState({
    email: '',
    password: ''
  })

  return (
    <div>
      <h1>Login Page</h1>
    </div>
  )
}

export default Login
