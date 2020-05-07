import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Select, Input, Grid, Table, Header, Pagination } from 'semantic-ui-react';
import { ceil } from 'mathjs';
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

			// Pagination
			page: 1,
			displayed: this.props.stocks.slice(0, 15),

			// Table Links
			stockPage: null,
			redirect: false
		}
	
		this.handleSort = this.handleSort.bind(this)
		this.handleDrop = this.handleDrop.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.updateFilters = this.updateFilters.bind(this)
		this.pageChange = this.pageChange.bind(this)
	}

	updateFilters(search, drop, stocks, page) {
		const f = stocks.filter(item => {
			return Object.keys(item).some(key =>
				item[key].toLowerCase().includes(search.toLowerCase())
			)
		}).filter(item => {
			return Object.keys(item).some(key =>
				item[key].includes(drop=='All'?'':drop)
			)
		})

		this.setState({
			filtered: f,
			displayed: f.slice((page-1)*15, page*15)
		})
	}

	pageChange(event, data) {
		this.setState({ page: data.activePage })
		this.updateFilters(this.state.search, this.state.drop, this.state.stocks, data.activePage)
	}

	handleSort = (clickedColumn) => () => {
		const { column, stocks, direction } = this.state
		if(column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				stocks: _.sortBy(stocks, clickedColumn=='Name'?'name':clickedColumn=='Ticker'?'symbol':'industry'),
				direction: 'ascending',
			})
			this.updateFilters(this.state.search, this.state.drop, _.sortBy(stocks, clickedColumn=='Name'?'name':clickedColumn=='Ticker'?'symbol':'industry'), this.state.page)
			return
		}
		this.setState({
			stocks: stocks.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending',
		})
		this.updateFilters(this.state.search, this.state.drop, stocks, this.state.page)
	}

	handleDrop(event, { value }) {
		this.setState({
			drop: value,
			page: 1
		})
		this.updateFilters(this.state.search, value, this.state.stocks, 1)
	}

	componentDidUpdate() {
		if(!this.state.redirect) this.nameInput.focus()
	}

	handleSearch(event, { value }) {
		this.setState({
			search: value,
			page: 1
		})
		this.updateFilters(value, this.state.drop, this.state.stocks, 1)
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
				{this.state.displayed.map(o => (
					<Table.Row key={o.symbol} onClick={this.handleClick(o)}>
						<Table.Cell>{o.name}</Table.Cell>
						<Table.Cell>{o.symbol}</Table.Cell>
						<Table.Cell>{o.industry}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		)

		const Pages = () => (
			<Pagination
				style={{ display: "flex", justifyContent: "center" }}
				defaultActivePage={this.state.page}
				pointing
				secondary
				totalPages={ceil(this.state.filtered.length/15)}
				onPageChange={this.pageChange}
			/>
		)

		const Structure = () => (
			<div style={{ width: "800px" }}>
				<Grid columns={3}>
					<Grid.Row>
						<Grid.Column style={{ width: "37%" }}><Search /></Grid.Column>
						<Grid.Column style={{ width: "26%" }} />
						<Grid.Column style={{ width: "37%" }}><Industry /></Grid.Column>
					</Grid.Row>
				</Grid>
				<Table fixed striped sortable selectable>
					<TableHeader />
					<TableBody />
				</Table>
				<Pages />
			</div>
		)


		return (
			<Structure />
		)
	}
}

export default Landing;
