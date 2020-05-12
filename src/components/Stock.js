import React, { Component } from 'react';
import { Header, Modal, Table, Pagination, Card } from 'semantic-ui-react';
import queryString from 'query-string';
import Loading from './Loading';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { ceil } from 'mathjs';
import Graph from './Graph';
import $ from 'jquery';
import _ from 'lodash';

class Stock extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ticker: queryString.parse(this.props.location.search).ticker,
			stocks: this.props.stocks,
			industries: this.props.industries,
			range: [new Date(1572998400000), new Date(1585058399000)],
			loading: true,
			modal: false,
			err: null,

			// Filter
			filtered: [],

			// Pagination
			page: 1,
			stockData: [],

			// Sorting
			column: null,
			direction: null

		}
		this.date = [new Date(1572998400000), new Date(1585058399000)]
		this.pageChange = this.pageChange.bind(this)
		this.close = this.close.bind(this)
		this.handleDate = this.handleDate.bind(this)
		this.handleSort = this.handleSort.bind(this)
		this.sortDates = this.sortDates.bind(this)
		this.getFiltered = this.getFiltered.bind(this)
		this.getRandomColour = this.getRandomColour.bind(this)
	}

	getFiltered() {
		return(this.state.stockData.filter(item => (
			this.sortDates(new Date(item.timestamp), new Date(this.date[1].getTime()+86400000)) < 1 &&
			this.sortDates(new Date(item.timestamp), new Date(this.date[0].getTime()+86400000)) > -1
		)))
	}

	pageChange(event, data) {
		this.setState({ page: data.activePage })
	}

	close() {
		this.setState({ modal: false })
		if(this.state.err.res.status===403) {
			sessionStorage.removeItem("token")
			this.props.update()
		}
	}

	sortDates(a, b) { // Two Dates or strings in the format (mm/dd/yyyy) or (m/d/yyyy)
			// Return 1 if a later than b
			// Return -1 if a earlier than b
			// Return 0 if a and b are the same day
		if(typeof a=='object') a = a.toJSON()
		if(typeof b=='object') b = b.toJSON()
		a = [a.split(8, 10), a.split(5, 7), a.split(0, 4)]
		b = [b.split(8, 10), b.split(5, 7), b.split(0, 4)]
		if(a[2] > b[2]) {
			return 1
		} else if(b[2] > a[2]) {
			return -1
		} else {
			if(a[1] > b[1]) {
				return 1
			} else if(b[1] > a[1]) {
				return -1
			} else {
				if(a[0] > b[0]) {
					return 1
				} else if(b[0] > a[0]) {
					return -1
				} else {
					return 0
				}
			}
		}
	}

	handleDate(event, data) {
		this.date = data.value
		if(this.date===null || this.date.length===2) {
			if(this.date===null) this.date=[new Date(1572998400000), new Date(1585058399000)]
			if(this.state.direction===null) {
				this.setState({
					range: this.date,
					page: 1,
					filtered: this.state.stockData.filter(item => (
						this.sortDates(new Date(item.timestamp), new Date(this.date[1].getTime()+86400000)) < 1 &&
						this.sortDates(new Date(item.timestamp), new Date(this.date[0].getTime()+86400000)) > -1
					))
				})
				this.sortDates(this.date[0], this.date[1])
			} else if(this.state.direction==='ascending') {
				this.setState({ 
					range: this.date,
					page: 1,
					filtered: _.sortBy(
						this.state.stockData.filter(item => (
							this.sortDates(new Date(item.timestamp), new Date(this.date[1].getTime()+86400000)) < 1 &&
							this.sortDates(new Date(item.timestamp), new Date(this.date[0].getTime()+86400000)) > -1
						)),
						this.state.column==='Date'?
							'timestamp'
						:this.state.column==='Open'?
							'open'
						:this.state.column==='High'?
							'high'
						:this.state.column==='Low'?
							'low'
						:this.state.column==='Close'?
							'close'
						:
							'volumes'
					)
				})
			} else {
				this.setState({ 
					range: this.date,
					page: 1,
					filtered: _.sortBy(
						this.state.stockData.filter(item => (
							this.sortDates(new Date(item.timestamp), new Date(this.date[1].getTime()+86400000)) < 1 &&
							this.sortDates(new Date(item.timestamp), new Date(this.date[0].getTime()+86400000)) > -1
						)),
						this.state.column==='Date'?
							'timestamp'
						:this.state.column==='Open'?
							'open'
						:this.state.column==='High'?
							'high'
						:this.state.column==='Low'?
							'low'
						:this.state.column==='Close'?
							'close'
						:
							'volumes'
					).reverse()
				})
			}
			this.forceUpdate()
			if(this.state.stockData.filter(item => (
				this.sortDates(new Date(item.timestamp), new Date(this.date[1].getTime()+86400000)) < 1 &&
				this.sortDates(new Date(item.timestamp), new Date(this.date[0].getTime()+86400000)) > -1
			)).length===0) {
				this.setState({
					modal: true,
					err: {
						res: {
							status: 401
						}
					}
				})
				this.handleDate(event, {value: [new Date(1572998400000), new Date(1585058399000)]})
			}
		}

		// Load on each date change -- OLD

		/*if(this.date==null || this.date.length==2) {
			const tempRange=this.state.range
			this.setState({ 
				range: this.date==null?[new Date(1577800800000), new Date()]:this.date, 
				page: 1, 
				loading: true,
			})
			$.ajax({
				url:
					'http://131.181.190.87:3000/stocks/authed/'+
					this.state.ticker+
					'?from='+
					(this.date==null?new Date(1577800800000):new Date(this.date[0].getTime()+86400000)).toISOString().slice(0, 10)+
					'&to='+
					(this.date==null?new Date():this.date[1]).toISOString().slice(0, 10)
				,
				type: 'GET',
				dataType: 'json',
				success: (res) => {
					this.setState({ 
						loading: false, 
						stockData: res,
						column: null,
						direction: null
					})
				},
				error: (res, status) => {
					this.setState({ 
						loading: false, 
						modal: true, 
						err: { 
							res: res, 
							status: status 
						}, 
						range: tempRange 
					})
				},
				beforeSend: setHeader
			})

			function setHeader(xhr) {
				xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem("token")}`)
			}
		}*/
	}

	componentDidMount() {
		if(sessionStorage.getItem("token") != null) {
			$.ajax({
				url: 'http://131.181.190.87:3000/stocks/authed/'+this.state.ticker+'?from=2019-11-06&to=2020-03-24',
				type: 'GET',
				dataType: 'json',
				success: (res) => {
					this.setState({ stockData: res, filtered: res, page: 1, loading: false })
				},
				error: (res, status) => {
					this.setState({ loading: false, modal: true, err: { res: res, status: status } })
				},
				beforeSend: setHeader
			})

			function setHeader(xhr) {
				xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem("token")}`)
			}

		} else {
			$.getJSON(
				'http://131.181.190.87:3000/stocks/'+this.state.ticker,
				(res) => {
					this.setState({ stockData: [res], loading: false })
				}
			)
		}
	}

	getRandomColour() {
		return ['red',
			'orange',
			'yellow',
			'olive',
			'green',
			'teal',
			'blue',
			'violet',
			'purple',
			'pink',
			'brown',
			'grey',
			'black'
			][
				Math.round(Math.random()*14)
			]
	}

	handleSort = (clickedColumn) => () => {
		const { column, filtered, direction } = this.state
		if(column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				filtered: _.sortBy(filtered, 
					clickedColumn==='Date'?
						'timestamp'
					:clickedColumn==='Open'?
						'open'
					:clickedColumn==='High'?
						'high'
					:clickedColumn==='Low'?
						'low'
					:clickedColumn==='Close'?
						'close'
					:
						'volumes'
				),
				direction: 'ascending'
			})
			return
		}
		this.setState({
			filtered: filtered.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending'
		})
	}

	render() {

		const Pages = () => (
			<Pagination
				style={{ display: "flex", justifyContent: "center" }}
				defaultActivePage={this.state.page}
				pointing
				secondary
				totalPages={ceil(this.state.filtered.length/5)}
				onPageChange={this.pageChange}
			/>
		)

		const StockData = () => {
			if(sessionStorage.getItem("token") != null) {
				return (
					<div style={{ marginTop: "10px" }}>
						<SemanticDatepicker
							onChange={(event, data) => this.handleDate(event, data)}
							type='range'
							format='DD/MM/YYYY'
							value={this.state.range}
							showOutsideDays={true}
						/>
						<Table fixed striped sortable compact>
							<Table.Header>
								<Table.Row>
									{['Date', 'Open', 'High', 'Low', 'Close', 'Volume'].map(o => (
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
							<Table.Body>
								{this.state.filtered.slice((this.state.page-1)*5, this.state.page*5).map(o => (
									<Table.Row key={o.timestamp}>
										<Table.Cell>
											{o.timestamp.slice(8, 10)}/
											{o.timestamp.slice(5, 7)}/
											{o.timestamp.slice(0, 4)}
										</Table.Cell>
										<Table.Cell>{o.open}</Table.Cell>
										<Table.Cell>{o.high}</Table.Cell>
										<Table.Cell>{o.low}</Table.Cell>
										<Table.Cell>{o.close}</Table.Cell>
										<Table.Cell>{o.volumes}</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
						<Pages />
					</div>
				)
			} else {
				return (
					<div>
						<br /><br />
						<Card.Group>
							{['Open', 'Close', 'Low', 'High', 'Volume'].map(o => (
								<Card
									key={
										o
									}
									fluid
									color={
										this.getRandomColour()
									}
									header={
										o
									}
									meta={
										this.state.stockData[0].timestamp.slice(8,10)+'/'+ 
										this.state.stockData[0].timestamp.slice(5, 7)+'/'+ 
										this.state.stockData[0].timestamp.slice(0, 4)
									}
									description={
										o==='Open'?
											this.state.stockData[0].open
										:o==='Close'?
											this.state.stockData[0].close
										:o==='Low'?
											this.state.stockData[0].low
										:o==='High'?
											this.state.stockData[0].high
										:
											this.state.stockData[0].volumes
									}
								/>
							))}
						</Card.Group>
					</div>
					/*<Header as='h2' style={{ width: "500px", margin: "0 auto", marginTop: "10px" }}>
						{Object.entries(this.state.stockData[0]).map(([key, value]) => (
							<Header.Subheader key={key}>{key}: {value}</Header.Subheader>
						))}
					</Header>*/
				)

			}
		}

		const Mod = () => (
			<Modal
				open={this.state.modal}
				onClose={this.close}
			>
				<Modal.Header>
					{
						this.state.err===null?
							''
						:this.state.err.res.status===400?
							'Invalid parameters'
						:this.state.err.res.status===403?
							'Session expired'
						:
							'Out of range'
					}
				</Modal.Header>
				<Modal.Content>
					{
						this.state.err===null?
							''
						:this.state.err.res.status===400?
							'Something went wrong'
						:this.state.err.res.status===403?
							'Please log in again'
						:
							'No entries could be found for the given range'					}
				</Modal.Content>
			</Modal>
		)

		if(this.state.loading) {
			return <Loading />
		}

		if(this.state.stocks.some(stock => stock.symbol === this.state.ticker)) {
			return (
				<div>
					<Mod />
					<Header as='h2' style={{ width: "600px", margin: "0 auto" }}>
						{this.state.ticker} - {this.state.stocks.find(o => o.symbol === this.state.ticker).name}{sessionStorage.getItem("token")===null?': Quick status':''}
					</Header>
					<StockData />
					<br /><br />
					{sessionStorage.getItem("token")===null?<div></div>:<Graph get={this.getFiltered} />}
				</div>
			)
		}

		return (
			<Header as='h1' style={{ width: "300px", margin: "0 auto", "margin-top": "50px" }}>
				Error 404
				<Header.Subheader>Could not find a stock with that ticker</Header.Subheader>
			</Header>
		)
	}
}

export default Stock
