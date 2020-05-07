import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Select, Input, Grid, Table } from 'semantic-ui-react';
import $ from 'jquery';
import _ from 'lodash';

class Landing extends Component {
	constructor(props) {
		super(props)
		this.state = {
			industry: '',
			textValue: '',
			dropValue: '',
			industries: this.props.industries,
			stocks: this.props.stocks,
			column: null,
			direction: null,
			stockPage: null,
			redirect: false
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

	handleSort = (clickedColumn) => () => {
		const { column, stocks, direction } = this.state

		if(column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				data: _.sortBy(stocks, [clickedColumn]),
				direction: 'ascending'
			})
			return
		}

		this.setState({
			stocks: stocks.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending'
		})
	}

	handleClick = (object) => () => {
		this.setState({ redirect: true, stockPage: object.symbol })
	}

	render() {

		if(this.state.redirect) {
			return <Redirect push to={"/stock?ticker="+this.state.stockPage} />
		}
	
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
						<Table.HeaderCell 
							sorted={this.state.column === o ? this.state.direction : null}
							onClick={this.handleSort(o)}
						>
							{o}
						</Table.HeaderCell>
					))}
				</Table.Row>
			</Table.Header>
		)

		const TableBody = () => (
			<Table.Body>
				{this.state.stocks.map(o => (
					<Table.Row onClick={this.handleClick(o)}>
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
				<Table fixed striped sortable selectable>
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
