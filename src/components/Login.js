import React, { Component, useState } from 'react';
import { Link, Route, NavLink, matchPath } from 'react-router-dom';
import { Form, Tab, Input, Button } from 'semantic-ui-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import $ from 'jquery';

class Login extends Component {
	constructor(props) {
		super(props)

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
						<LoginForm setToken={this.props.setToken} />
						<p style={{ textAlign: "center" }}>
							Not a member? <Link to="/register">Register now!</Link>
						</p>
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
						<RegisterForm />
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
