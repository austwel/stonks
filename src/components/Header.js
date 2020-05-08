import React, { Component } from 'react';
import { Button, Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import jwt from 'jsonwebtoken';

class Header extends Component {
	constructor(props) {
		super(props)

		this.logOut = this.logOut.bind(this)
	}

	logOut() {
		sessionStorage.removeItem("token")
		this.props.update()
	}

	render() {
		
		const Logins = () => {
			if(sessionStorage.getItem("token") != null) {
				return (
					<div>
						<span style={{ marginRight: "10px" }}>{jwt.decode(sessionStorage.getItem("token")).email}</span>
						<Button compact onClick={this.logOut}>Log out</Button>
					</div>
				)
			} else {
				return (
					<div>
						<Link to="/login"><Button compact>Login</Button></Link>
						<Link to="/register"><Button compact>Register</Button></Link>
					</div>
				)
			}
		}

		return (
			<div style={{ width: "800px", margin: "0 auto" }}>
				<nav>
					<div style={{ float: "left", margin: "10px" }}>
						<Link to="/"><Button compact>Stock List</Button></Link>
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
