import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';
import $ from 'jquery';

class Landing extends Component {
	constructor(props) {
		super(props)
		this.state = {
			industry: '',
			textValue: '',
			dropValue: '',
			industries: [
				"Health Care",
				"Financials",
				"Industrials",
				"Real Estate",
				"Consumer Discretionary",
				"Materials",
				"Information Technology",
				"Energy",
				"Consumer Staples",
				"Telecommunication Services",
				"Utilities"
			],
			stocks: []
		}

		this.handleText = this.handleText.bind(this)
		this.handleDrop = this.handleDrop.bind(this)
	}

	handleText(event) {
		this.setState({ textValue: event.target.value, industry: event.target.value, dropValue: '' })
	}

	handleDrop(event, data) {
		this.setState({ dropValue: data.value, industry: data.value, textValue: '' })
	}

	render() {
		const menu = (s) => (
			<div style={s}>
			<Menu vertical>
				<Dropdown
					placeholder='Industry'
					fluid
					selection
					options={this.state.industries.map(o => ({
						key: o,
						text: o,
						value: o
					}))}
					onChange={this.handleDrop} 
				/>
			</Menu>
			</div>
		)


		return (
			<div style={{ width: "800px", margin: "0 auto" }}>
				<div style={{ margin: "0 auto", overflow: "hidden" }}>
					<input style={{ float: "left" }} type='text' placeholder='Industry' value={this.state.textValue} onChange={this.handleText}></input>
					<a>OR</a>
					{menu({ float: "right" })}
				</div>
				<Link to="/stock&symbol=AAL">Example Stock</Link>
			</div>
		)
	}
}

export default Landing;
