import React, { Component }  from 'react';
import Landing from "./components/Landing";
import Header from "./components/Header";
import Stock from "./components/Stock";
import Login from "./components/Login"
import Register from "./components/Register";
import "semantic-ui-css/semantic.min.css";
import { Grid } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
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
										<Route path="/" exact component={Landing} />
										<Route path="/stock" component={Stock} />
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
