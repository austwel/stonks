import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
	constructor(props) {
		super(props)

		this.logOut = this.logOut.bind(this)
	}

	logOut() {
		this.props.setToken({ token: null, user: null })
	}

	render() {
		
		const Logins = () => {
			if(this.props.token != null) {
				return (
					<div>
						{this.props.user}
						<a style={{ margin: "20px" }} href='#' onClick={this.logOut}>Log out</a>
					</div>
				)
			} else {
				return (
					<div>
						<Link to="/login" style={{ margin: "10px" }}>Login</Link>
						<Link tp="/register" style={{ margin: "10px" }}>Register</Link>
					</div>
				)
			}
		}

		return (
			<div style={{ width: "800px", margin: "0 auto" }}>
				<nav>
					<div style={{ float: "left", margin: "10px" }}>
						<Link to="/">Stock List</Link>
					</div>
					<div style={{ float: "right", margin: "10px" }}>
						<Logins />
					</div>
				</nav>
			</div>
		)
	}
}

export default Header;
