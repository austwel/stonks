import React, { Component, setState } from 'react';
import { Header, Modal, Table, Pagination } from 'semantic-ui-react';
import queryString from 'query-string';
import Loading from './Loading';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { ceil } from 'mathjs';
import $ from 'jquery';
import _ from 'lodash';

class Stock extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ticker: queryString.parse(this.props.location.search).ticker,
			stocks: this.props.stocks,
			industries: this.props.industries,
			range: [new Date(1577800800000), new Date()],
			loading: true,
			modal: false,
			err: null,

			// Pagination
			page: 1,
			stockData: [],

			// Sorting
			column: null,
			direction: null,
		}
		this.date = []
		this.pageChange = this.pageChange.bind(this)
		this.close = this.close.bind(this)
		this.handleDate = this.handleDate.bind(this)
		this.handleSort = this.handleSort.bind(this)
	}

	pageChange(event, data) {
		this.setState({ page: data.activePage })
	}

	close() {
		this.setState({ modal: false })
		if(this.state.err.status==403) {
			sessionStorage.removeItem("token")
			this.props.update()
		}
	}

	handleDate(event, data) {
		this.date = data.value
		if(this.date==null || this.date.length==2) {
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
		}
	}

	componentDidMount() {
		if(sessionStorage.getItem("token") != null) {
			$.ajax({
				url: 'http://131.181.190.87:3000/stocks/authed/'+this.state.ticker+'?from=2020-01-01',
				type: 'GET',
				dataType: 'json',
				success: (res) => {
					this.setState({ stockData: res, page: 1, loading: false })
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

	handleSort = (clickedColumn) => () => {
		const { column, stockData, direction } = this.state
		if(column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				stockData: _.sortBy(stockData, 
					clickedColumn=='Date'?
						'timestamp'
					:clickedColumn=='Open'?
						'open'
					:clickedColumn=='High'?
						'high'
					:clickedColumn=='Low'?
						'low'
					:clickedColumn=='Close'?
						'close'
					:
						'volumes'
				),
				direction: 'ascending'
			})
			return
		}
		this.setState({
			stockData: stockData.reverse(),
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
				totalPages={ceil(this.state.stockData.length/5)}
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
								{this.state.stockData.slice((this.state.page-1)*5, this.state.page*5).map(o => (
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
					<Header as='h2' style={{ width: "500px", margin: "0 auto", marginTop: "10px" }}>
						{Object.entries(this.state.stockData[0]).map(([key, value]) => (
							<Header.Subheader key={key}>{key}: {value}</Header.Subheader>
						))}
					</Header>
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
						this.state.err==null?
							''
						:this.state.err.status==400?
							'Invalid parameters'
						:this.state.err.status==403?
							'Session expired'
						:
							'Out of range'
					}
				</Modal.Header>
				<Modal.Content>
					{
						this.state.err==null?
							''
						:this.state.err.status==400?
							'Something went wrong'
						:this.state.err.status==403?
							'Please log in again'
						:
							'No entries could be found for the given range'
					}
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
						{this.state.ticker} - {this.state.stocks.find(o => o.symbol == this.state.ticker).name}{sessionStorage.getItem("token")==null?': Quick status':''}
					</Header>
					<StockData />
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
