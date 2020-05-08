import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Modal } from 'semantic-ui-react';
import $ from 'jquery';

class LoginForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: '',
			password: '',
			redirect: false,
			modal: false,
			errors: {
				statusText: '',
				responseJSON: {
					message: ''
				}
			}
		}
		
		this.handleEmail = this.handleEmail.bind(this)
		this.handlePassword = this.handlePassword.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.close = this.close.bind(this)
	}

	handleEmail(event) { this.setState({ email: event.target.value }) }

	handlePassword(event) { this.setState({ password: event.target.value }) }

	handleSubmit(event) {
		$.post('http://131.181.190.87:3000/user/login', {
			email: this.state.email,
			password: this.state.password
		}, (res, status) => {
			this.setState({ redirect: true })
			sessionStorage.setItem("token", res.token)
			this.props.update()
		}, 'json')
			.then(() => {
			})
			.fail((res) => { 
				this.setState({ errors: res, modal: true })
			})
	}

	close() { this.setState({ modal: false }) }

	render() {
		
		if(this.state.redirect) {
			return <Redirect push to="/" />
		}
		
		const Mod = () => (
			<Modal 
				open={this.state.modal} 
				onClose={this.close}
			>
				<Modal.Header>
					{this.state.errors.statusText}
				</Modal.Header>
				<Modal.Content>
					{this.state.errors.responseJSON.message}
				</Modal.Content>
			</Modal>
		)
		
		return (
			<div>
				<Mod />
				<Form style={{ margin: "21px" }} onSubmit={this.handleSubmit}>
					<Form.Field 
						control={Input} 
						label='Email' 
						placeholder='Email' 
						type='email'
						value={this.state.email}
						onChange={this.handleEmail}
					/>
					<Form.Field 
						control={Input} 
						label='Password' 
						placeholder='Password' 
						type='password'
						value={this.state.password}
						onChange={this.handlePassword}
					/>
					<Form.Field control={Button}>Login</Form.Field>
				</Form>
			</div>
		)
	}
}

export default LoginForm
