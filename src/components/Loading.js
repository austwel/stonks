import React, { Component } from 'react';
import { Ellipsis } from 'react-spinners-css';

class Stock extends Component {
	render() {
		return (
			<div style={{ width: "64px", margin: "auto", marginTop: "50px" }}>
				<Ellipsis color='#A9A9A9' />
			</div>
		)
	}
}

export default Stock
