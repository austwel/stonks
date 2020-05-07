import React, { Component, useState, useEffect }  from 'react';
import Landing from "./components/Landing";
import Header from "./components/Header";
import Stock from "./components/Stock";
import Login from "./components/Login";
import Loading from "./components/Loading";
import "semantic-ui-css/semantic.min.css";
import { Grid } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import $ from 'jquery';

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			stocks: [],
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
			]
		}
	}

	componentDidMount() {
		$.getJSON("http://131.181.190.87:3000/stocks/symbols", (res) => {
			this.setState({ stocks: res, loading: false })
		})
	}

	render() {

		const WaitingRoutes = () => {
			if(this.state.loading) {
				return (
					<div>
						<Route path="/" exact component={Loading} />
						<Route path="/stock" component={Loading} />
					</div>
				)
			} else {
				return (
					<div>
						<Route path="/" exact render={(props) => <Landing {...props} stocks={this.state.stocks} industries={this.state.industries} loading={this.state.loading} onPropChange={this.onChange} />} />
						<Route path="/stock" render={(props) => <Stock {...props} stocks={this.state.stocks} industries={this.state.industries} loading={this.state.loading} />} />
					</div>
				)
			}
		}
		
		return (
			<Router>
		  		<div className="App">
					<Grid columns={1}>
						<Grid.Row>
							<Grid.Column>
		  						<Header />
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<div style={{ width: "800px", margin: "0 auto" }}>
									<Switch>
										<Route path="/login" component={Login} />
										<Route path="/register" component={Login} />
										<WaitingRoutes />
									</Switch>
								</div>
							</Grid.Column>
						</Grid.Row>
					</Grid>
		  		</div>
			</Router>
		)
	}
}

export default App;
