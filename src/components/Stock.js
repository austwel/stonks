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
			industries: this.props.industries
		}
	}

	render() {
		console.log(this.state.stocks)
		if(!this.state.stocks.some(stock => stock.symbol === this.state.ticker)) {
			return (
				<Header as='h1' style={{ width: "300px", margin: "0 auto", "margin-top": "50px" }}>
					Error 404
					<Header.Subheader>Could not find a stock with that ticker</Header.Subheader>
				</Header>
			)
		}

		return (
			<h1>{this.state.ticker}</h1>
		)
	}
}

export default Stock
