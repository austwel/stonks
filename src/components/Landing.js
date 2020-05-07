import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Select, Input, Grid, Table, Header } from 'semantic-ui-react';
import $ from 'jquery';
import _ from 'lodash';

class Landing extends Component {
	constructor(props) {
		super(props)
		this.state = {
			//Props
			industries: this.props.industries,
			stocks: this.props.stocks,
			loading: this.props.loading,
			
			// Table Filtering
			search: '',
			drop: '',
			filtered: this.props.stocks,
			
			// Table Sorting
			column: null,
			direction: null,

			// Table Links
			stockPage: null,
			redirect: false
		}
	
		this.handleSort = this.handleSort.bind(this)
		this.handleDrop = this.handleDrop.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.updateFilters = this.updateFilters.bind(this)
	}

	updateFilters(search, drop, stocks) {
		this.setState({
			filtered: stocks.filter(item => {
				return Object.keys(item).some(key =>
					item[key].toLowerCase().includes(search.toLowerCase())
				)
			}).filter(item => {
				return Object.keys(item).some(key =>
					item[key].toLowerCase().includes(drop=='All'?'':drop.toLowerCase())
				)
			})
		})
	}

	handleSort = (clickedColumn) => () => {
		const { column, stocks, direction } = this.state
		if(column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				stocks: _.sortBy(stocks, clickedColumn=='Name'?'name':clickedColumn=='Ticker'?'symbol':'industry'),
				direction: 'ascending',
			})
			this.updateFilters(this.state.search, this.state.drop, _.sortBy(stocks, clickedColumn=='Name'?'name':clickedColumn=='Ticker'?'symbol':'industry'))
			return
		}
		this.setState({
			stocks: stocks.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending',
		})
		this.updateFilters(this.state.search, this.state.drop, stocks)
	}

	handleDrop(event, { value }) {
		this.setState({
			drop: value
		})
		this.updateFilters(this.state.search, value, this.state.stocks)
	}

	componentDidUpdate() {
		if(!this.state.redirect) this.nameInput.focus()
	}

	handleSearch(event, { value }) {
		this.setState({
			search: value
		})
		this.updateFilters(value, this.state.drop, this.state.stocks)
	}

	handleClick = (object) => () => {
		this.setState({ redirect: true, stockPage: object.symbol })
	}

	render() {

		if(this.state.redirect) {
			return <Redirect push to={"/stock?ticker="+this.state.stockPage} />
		}
	
		const Search = () => (
			<Input 
				key='search'
				ref={(input) => (this.nameInput = input)}
				style={{ width: "100%" }} 
				placeholder='Search' 
				icon='search' 
				iconPosition='left' 
				value={this.state.search}
				onChange={this.handleSearch}
			/>
		)

		const Industry = () => (
			<Select
				key='drop'
				placeholder='Industry'
				fluid
				options={this.state.industries.map(o => ({
					key: o,
					text: o,
					value: o
				}))}
				value={this.state.drop}
				onChange={this.handleDrop} 
			/>
		)

		const TableHeader = () => (
			<Table.Header>
				<Table.Row>
					{["Name", "Ticker", "Industry"].map(o => (
						<Table.HeaderCell 
							key={o}
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
				{this.state.filtered.map(o => (
					<Table.Row key={o.symbol} onClick={this.handleClick(o)}>
						<Table.Cell>{o.name}</Table.Cell>
						<Table.Cell>{o.symbol}</Table.Cell>
						<Table.Cell>{o.industry}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		)

		const Structure = () => (
			<div style={{ width: "800px" }}>
				<Grid columns={3}>
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
