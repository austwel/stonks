import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Select, Input, Segment, Grid } from 'semantic-ui-react';
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
	
		const indInput = () => <Input placeholder='Industry' value={this.state.textValue} onChange={this.handleText} />

		const selInput = () => (
			<Select
				placeholder='Industry'
				fluid
				options={this.state.industries.map(o => ({
					key: o,
					text: o,
					value: o
				}))}
				onChange={this.handleDrop} 
			/>
		)

		const structure = () => (
			<div>
				<Grid Columns={1}>
					<Grid.Row>
						<Grid.Column>
							<indInput />
							<selInput />
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<Link to="/stock$symbol=AAL">Example</Link>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		)


		return structure()
	}
}

export default Landing;
