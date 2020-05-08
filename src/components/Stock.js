import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import queryString from 'query-string';
import $ from 'jquery';

class Stock extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ticker: queryString.parse(this.props.location.search).ticker,
			stocks: this.props.stocks,
			industries: this.props.industries,
			stockData: {}
		}
	}

	render() {

		const StockData = () => {
			if(sessionStorage.getItem("token") != null) {
				$.ajax({
					url: 'http://131.181.190.87:300/stocked/authed/'+this.state.ticker,
					type: 'GET',
					dataType: 'json',
					success: (res) => {
						console.log(res)
					},
					error: (res) => {
						console.log(res)
					},
					beforeSend: setHeader

				})

				function setHeader(xhr) {
					xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem("token")}`)
				}
				return (
					<div>logged in</div>
				)
			} else {
				$.getJSON('http://131.181.190.87:3000/stocks/'+this.state.ticker, (res) => {
					//this.setState({ stockData: res })
				})

				return (
					<Header as='h2' style={{ width: "500px", margin: "0 auto" }}>
						{Object.entries(this.state.stockData).map(([key, value]) => (
							<Header.Subheader key={key}>{key}: {value}</Header.Subheader>
						))}
					</Header>
				)

			}
		}

		if(this.state.stocks.some(stock => stock.symbol === this.state.ticker)) {
			return (
				<div>
					<Header as='h2' style={{ width: "600px", margin: "0 auto" }}>
						{this.state.ticker} - {this.state.stocks.find(o => o.symbol == this.state.ticker).name}
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
