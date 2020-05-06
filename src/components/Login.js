import React, { Component } from 'react';
import { Link, Route, NavLink, matchPath } from 'react-router-dom';
import { Form, Tab, Input, Button } from 'semantic-ui-react';
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
		
		const panes = [{
				menuItem: {
					as: NavLink,
					content: 'Login',
					to: '/login',
					key: 'login'
				},
				render: () => (
					<Route path="/login">
						<Form style={{ margin: "21px" }}>
							<Form.Field control={Input} label='Email' placeholder='Email' type='email' />
							<Form.Field control={Input} label='Password' placeholder='Password' type='password' />
							<Form.Field control={Button}>Login</Form.Field>
						</Form>
						<p style={{ textAlign: "center" }}>Not a member? <Link to="/register">Register now!</Link></p>
					</Route>
				)
			}, {
				menuItem: {
					as: NavLink,
					content: 'Register',
					to: '/register',
					key: 'register'
				},
				render: () => (
					<Route path="/register">
						<Form style={{ margin: "21px" }}>
							<Form.Field required control={Input} label='Email' placeholder='Email' type='email' />
							<Form.Field control={Input} label='Username' placeholder='Username' />
							<Form.Field required control={Input} label='Password' placeholder='Password' type='password' />
							<Form.Field required control={Input} label='Confirm Password' placeholder='Password' type='password' />
							<Form.Field control={Button}>Register</Form.Field>
						</Form>
					</Route>
				)
			}
		]

		const defaultActiveIndex = panes.findIndex(pane => {
			return !!matchPath(window.location.pathname, {
				path: pane.menuItem.to,
				exact: true
			})
		})
		
		const TabMenu = () => <Tab defaultActiveIndex={defaultActiveIndex} panes={panes} />

		return (
			<TabMenu />
		)
	}
}

export default Login
