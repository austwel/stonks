import React, { Component } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';

class LoginForm extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Form style={{ margin: "21px" }}>
				<Form.Field control={Input} label='Email' placeholder='Email' type='email' />
				<Form.Field control={Input} label='Password' placeholder='Password' type='password' />
				<Form.Field control={Button}>Login</Form.Field>
			</Form>
		)
	}
}

export default LoginForm
