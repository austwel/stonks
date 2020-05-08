import React, { Component } from 'react';
import { Redirect} from 'react-router-dom';
import { Form, Input, Button, Modal } from 'semantic-ui-react';
import $ from 'jquery';

class RegisterForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: '',
			username: '',
			password: '',
			confirmPassword: '',
			modal: false,
			errors: {
				statusText: '',
				responseJSON: {
					message: ''
				}
			},
			redirect: false
		}

		this.handleEmail = this.handleEmail.bind(this)
		this.handleUsername = this.handleUsername.bind(this)
		this.handlePassword = this.handlePassword.bind(this)
		this.handleConfirm = this.handleConfirm.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.close = this.close.bind(this)
	}

	handleEmail(event) { this.setState({ email: event.target.value }) }

	handleUsername(event) { this.setState({ username: event.target.value }) }

	handlePassword(event) { this.setState({ password: event.target.value }) }

	handleConfirm(event) { this.setState({ confirmPassword: event.target.value }) }

	handleSubmit(event) {
		if(this.state.password === this.state.confirmPassword) {
			$.post('http://131.181.190.87:3000/user/register', {
				email: this.state.email,
				password: this.state.password
			}, (res, status) => {
			}, 'json')
				.done(() => {
					this.setState({ errors: {
							statusText: 'Account created',
							responseJSON: {
								message: `Account ${this.state.username} has been created`
							}
						},
						modal: true,
					})
				})
				.fail((res) => {
					this.setState({ errors: res, modal: true })
				})
		} else {
			this.setState({ 
				errors: {
					statusText: 'Error',
					responseJSON: {
						message: 'Passwords did not match'
					}
				},
				modal: true
			})
		}
	}

	close() { this.setState({ modal: false, redirect: true }) }

	render() {

		if(this.state.redirect) {
			return <Redirect push to="/login" />
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
						required 
						control={Input} 
						label='Email' 
						placeholder='Email' 
						type='email' 
						value={this.state.email}
						onChange={this.handleEmail}
					/>
					<Form.Field 
						control={Input} 
						label='Username' 
						placeholder='Username' 
						value={this.state.username}
						onChange={this.handleUsername}
					/>
					<Form.Field 
						required 
						control={Input} 
						label='Password' 
						placeholder='Password' 
						type='password' 
						value={this.state.password}
						onChange={this.handlePassword}
					/>
					<Form.Field 
						required 
						control={Input} 
						label='Confirm Password' 
						placeholder='Password' 
						type='password' 
						value={this.state.confirmPassword}
						onChange={this.handleConfirm}
					/>
					<Form.Field control={Button}>Register</Form.Field>
				</Form>
			</div>
		)
	}
}

export default RegisterForm
