import React from 'react'
import { Input } from '@progress/kendo-react-inputs';
const LoginForm = (props) => {
    return (
        <form className="k-form" onSubmit={props.loginHandler}>
        <fieldset>
            <legend>Agent Login</legend>
            <div className="mb-3">
                <Input
                    name="email"
                    type="email"
                    style={{ width: '100%' }}
                    label="Email address"
                    required={true}
                    onChange={props.onInputChange}
                />
            </div>
            <div className="mb-3">
                <Input
                    name="password"
                    type="password"
                    style={{ width: '100%' }}
                    label="Password"
                    required={true}
                    minLength={6}
                    maxLength={18}
                    onChange={props.onInputChange}
                />
            </div>
            <div  className="mt-4" style={{ width: '100%' }}>
                <input type="submit" className="k-button k-primary" style={{ width: '50%', margin: 'auto 0'}} value="Login" />
            </div>
        </fieldset>
    </form>
    )
}

export default LoginForm
