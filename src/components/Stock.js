import React, { Component, setState } from 'react';
import { Header, Modal, Table, Pagination } from 'semantic-ui-react';
import queryString from 'query-string';
import Loading from './Loading';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { ceil } from 'mathjs';
import $ from 'jquery';

class Stock extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ticker: queryString.parse(this.props.location.search).ticker,
			stocks: this.props.stocks,
			industries: this.props.industries,
			range: [],
			loading: true,
			modal: false,
			err: null,

			//Pagination
			page: 1,
			stockData: [],
			filtered: [],
			displayed: []
		}
		this.date = []
		this.pageChange = this.pageChange.bind(this)
		this.close = this.close.bind(this)
		this.handleDate = this.handleDate.bind(this)
	}

	pageChange(event, data) {
		this.setState({ page: data.activePage, displayed: this.state.filtered.slice((data.activePage-1)*5, data.activePage*5) })
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
		if(this.date==null) {
			this.setState({ range: [] })
		} else if(this.date.length==2) {
			this.setState({ range: this.date, displayed: this.state.filtered.slice((this.state.page-1)*5, this.state.page*5) })
		}
	}

	componentDidMount() {
		if(sessionStorage.getItem("token") != null) {
			$.ajax({
				url: 'http://131.181.190.87:3000/stocks/authed/'+this.state.ticker+'?from=2020-01-01',
				type: 'GET',
				dataType: 'json',
				success: (res) => {
					this.setState({ stockData: res, filtered: res, displayed: res.slice(0, 5), loading: false })
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
							value={this.state.range}
							showOutsideDays={true}
						/>
						<Table fixed striped sortable compact>
							<Table.Header>
								<Table.Row>
									{['Date', 'Open', 'High', 'Low', 'Close', 'Volume'].map(o => (
										<Table.HeaderCell
											key={o}
										>
											{o}
										</Table.HeaderCell>
									))}
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{this.state.displayed.map(o => (
									<Table.Row key={o.timestamp}>
										<Table.Cell>{o.timestamp}</Table.Cell>
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
					{this.state.err==null?
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
					{this.state.err==null?
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
						{this.state.ticker} - {this.state.stocks.find(o => o.symbol == this.state.ticker).name}{sessionStorage.getItem("token")==null?': Showing latest data':''}
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
