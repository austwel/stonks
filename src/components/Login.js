import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = { email: '', password: '' }

		this.handleEmail = this.handleEmail.bind(this)
		this.handlePassword = this.handlePassword.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleEmail(event) {
		this.setState({ email: event.target.value })
	}

	handlePassword(event) {
		this.setState({ password: event.target.value })
	}

	handleSubmit(event) {
		console.log(`Submitted: ${this.state.email} : ${this.state.password}`)
	}

	render() {
		return (
			<div style={{ width: "800px", margin: "0 auto" }}>
				<h1 style={{ textAlign: "center" }}>Login</h1>
				<form onSubmit={this.handleSubmit}>
					<label>Email<input type='email' placeholder='Email' value={this.state.email} onChange={this.handleEmail} /></label>
					<label>Password<input type='password' placeholder='Password' value={this.state.password} onChange={this.handlePassword} /></label>
					<input type='submit' value='Submit' />
				</form>
				<a style={{ textAlign: "center" }}>Not a member? <Link to="/register">Register now!</Link></a>
			</div>
		)
	}
}

export default Login
