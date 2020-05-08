import React, { Component, useState } from 'react';
import { Link, Route, NavLink, matchPath } from 'react-router-dom';
import { Form, Tab, Input, Button, Header } from 'semantic-ui-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import $ from 'jquery';

class Login extends Component {
	constructor(props) {
		super(props)

		this.logOut = this.logOut.bind(this)
	}

	logOut() {
		sessionStorage.removeItem("token")
		this.props.update()
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
						<LoginForm update={this.props.update} />
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
		
		if(sessionStorage.getItem("token") != null) {
			return (
				<Header as='h1' style={{ width: "300px", margin: "0 auto", marginTop: "50px" }}>
					Already Logged In
					<Header.Subheader onClick={this.logOut}>Click here to log out</Header.Subheader>
				</Header>
			)
		} else {
			return <TabMenu />
		}
	}
}

export default Login
