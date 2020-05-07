import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Select, Input, Grid, Table } from 'semantic-ui-react';
import $ from 'jquery';

class Landing extends Component {
	constructor(props) {
		super(props)
		this.state = {
			industry: '',
			textValue: '',
			dropValue: '',
			industries: [
				"All",
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
			stocks: [
				{
					name: "Stock 1",
					symbol: "SYM1",
					industry: "Health Care"
				},
				{
					name: "Stock 2",
					symbol: "SYM2",
					industry: "Financials"
				},
				{
					name: "Stock 3",
					symbol: "SYM3",
					industry: "Industrials"
				}
			]
		}

		this.handleText = this.handleText.bind(this)
		this.handleDrop = this.handleDrop.bind(this)
	}

	handleText(event) {
		this.setState({ })
	}

	handleDrop(event, data) {
		this.setState({ })
	}

	render() {
	
		const Search = () => (
			<Input style={{ width: "100%" }} placeholder='Search' icon='search' iconPosition='left' value={this.state.textValue} onChange={this.handleText} />
		)

		const Industry = () => (
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

		const TableHeader = () => (
			<Table.Header>
				<Table.Row>
					{["Name", "Ticker", "Industry"].map(o => (
						<Table.HeaderCell>{o}</Table.HeaderCell>
					))}
				</Table.Row>
			</Table.Header>
		)

		const TableBody = () => (
			<Table.Body>
				{this.state.stocks.map(o => (
					<Table.Row>
						<Table.Cell>{o.name}</Table.Cell>
						<Table.Cell>{o.symbol}</Table.Cell>
						<Table.Cell>{o.industry}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		)

		const Structure = () => (
			<div style={{ width: "800px" }}>
				<Grid Columns={3}>
					<Grid.Row>
						<Grid.Column style={{ width: "37%" }}><Search /></Grid.Column>
						<Grid.Column style={{ width: "26%" }}></Grid.Column>
						<Grid.Column style={{ width: "37%" }}><Industry /></Grid.Column>
					</Grid.Row>
				</Grid>
				<Table celled>
					<TableHeader />
					<TableBody />
				</Table>
			</div>
		)


		return (
			<Structure />
		)
	}
}

export default Landing;
