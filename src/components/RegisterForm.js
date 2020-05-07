import React, { Component } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';

class RegisterForm extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Form style={{ margin: "21px" }}>
				<Form.Field required control={Input} label='Email' placeholder='Email' type='email' />
				<Form.Field control={Input} label='Username' placeholder='Username' />
				<Form.Field required control={Input} label='Password' placeholder='Password' type='password' />
				<Form.Field required control={Input} label='Confirm Password' placeholder='Password' type='password' />
				<Form.Field control={Button}>Register</Form.Field>
			</Form>
		)
	}
}

export default RegisterForm
