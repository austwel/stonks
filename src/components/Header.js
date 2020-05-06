import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div style={{ width: "800px", margin: "0 auto" }}>
				<nav>
					<div style={{ float: "left", margin: "10px" }}>
						<Link to="/">Stock List</Link>
					</div>
					<div style={{ float: "right", margin: "10px" }}>
						<Link to="/login" style={{ margin: "10px" }}>Login</Link>
						<Link to="/register" style={{ margin: "10px" }}>Register</Link>
					</div>
				</nav>
			</div>
		)
	}
}

export default Header;
