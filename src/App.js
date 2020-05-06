import React, { Component }  from 'react';
import Landing from "./components/Landing";
import Header from "./components/Header";
import Stock from "./components/Stock";
import Login from "./components/Login"
import Register from "./components/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
	render() {
		return (
			<Router>
		  		<div className="App">
		  			<Header />
		  			<Switch>
		  				<Route path="/" exact component={Landing} />
		  				<Route path="/stock" component={Stock} />
		  				<Route path="/login" component={Login} />
		  				<Route path="/register" component={Register} />
		  			</Switch>
		  		</div>
			</Router>
		)
	}
}

export default App;
