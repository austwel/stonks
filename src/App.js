import React, { Component }  from 'react';
import Landing from "./components/Landing";
import Header from "./components/Header";
import Stock from "./components/Stock";
import Login from "./components/Login"
import "semantic-ui-css/semantic.min.css";
import { Grid } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			stocks: [
				{
					name: "Stock 1",
					symbol: "SYM1",
					industry: "Financials"
				},
				{
					name: "Stock 2",
					symbol: "SYM2",
					industry: "Industrials"
				},
				{
					name: "Stock 3",
					symbol: "SYM3",
					industry: "Health Care"
				}
			],
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

	render() {
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
										<Route path="/" exact render={(props) => <Landing {...props} stocks={this.state.stocks} industries={this.state.industries} />} />
										<Route path="/stock" render={(props) => <Stock {...props} stocks={this.state.stocks} industries={this.state.industries} />} />
										<Route path="/login" component={Login} />
										<Route path="/register" component={Login} />
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
