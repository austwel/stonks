import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class Graph extends Component {
	constructor(props) {
		super(props)
		this.data = {
			labels: this.props.get().map(o => (
				o.timestamp.slice(8, 10)+'/'+
				o.timestamp.slice(5, 7)+'/'+
				o.timestamp.slice(0, 4)
			)).reverse(),
			datasets: [{
				hidden: true,
				label: 'Open',
				fill: true,
				lineTension: 0.1,
				backgroundColor: 'rgba(60, 60, 60, 0.05)',
				borderColor: 'rgba(170, 170, 170, 0.5)',
				borderCapStyle: 'butt',
				pointBorderColor: 'rgba(220, 220, 220, 0.5)',
				pointBorderWidth: 1,
				pointHoverRadius: 15,
				pointHoverBackgroundColor: 'rgba(220, 220, 220, 0.5)',
				pointHoverBorderColor: 'rgba(50, 50, 50, 1)',
				pointHoverBorderWidth: 5,
				pointRadius: 1,
				pointHitRadius: 15,
				data: this.props.get().map(o => (o.open)).reverse()
			}, {
				label: 'High',
				fill: true,
				lineTension: 0.1,
				backgroundColor: 'rgba(60, 60, 60, 0.05)',
				borderColor: 'rgba(170, 170, 170, 0.5)',
				borderCapStyle: 'butt',
				pointBorderColor: 'rgba(220, 220, 220, 0.5)',
				pointBorderWidth: 1,
				pointHoverRadius: 15,
				pointHoverBackgroundColor: 'rgba(220, 220, 220, 0.5)',
				pointHoverBorderColor: 'rgba(50, 50, 50, 1)',
				pointHoverBorderWidth: 5,
				pointRadius: 1,
				pointHitRadius: 15,
				data: this.props.get().map(o => (o.high)).reverse()
			}, {
				label: 'Low',
				fill: true,
				lineTension: 0.1,
				backgroundColor: 'rgba(60, 60, 60, 0.05)',
				borderColor: 'rgba(170, 170, 170, 0.5)',
				borderCapStyle: 'butt',
				pointBorderColor: 'rgba(220, 220, 220, 0.5)',
				pointBorderWidth: 1,
				pointHoverRadius: 15,
				pointHoverBackgroundColor: 'rgba(220, 220, 220, 0.5)',
				pointHoverBorderColor: 'rgba(50, 50, 50, 1)',
				pointHoverBorderWidth: 5,
				pointRadius: 1,
				pointHitRadius: 15,
				data: this.props.get().map(o => (o.low)).reverse()
			}, {
				hidden: true,
				label: 'Close',
				fill: true,
				lineTension: 0.1,
				backgroundColor: 'rgba(60, 60, 60, 0.05)',
				borderColor: 'rgba(170, 170, 170, 0.5)',
				borderCapStyle: 'butt',
				pointBorderColor: 'rgba(220, 220, 220, 0.5)',
				pointBorderWidth: 1,
				pointHoverRadius: 15,
				pointHoverBackgroundColor: 'rgba(220, 220, 220, 0.5)',
				pointHoverBorderColor: 'rgba(50, 50, 50, 1)',
				pointHoverBorderWidth: 5,
				pointRadius: 1,
				pointHitRadius: 15,
				data: this.props.get().map(o => (o.close)).reverse()
			}, {
				hidden: true,
				label: 'Volume',
				fill: false,
				lineTension: 0.1,
				backgroundColor: 'rgba(60, 60, 60, 0.1)',
				borderColor: 'rgba(170, 170, 170, 0.5)',
				borderCapStyle: 'butt',
				pointBorderColor: 'rgba(220, 220, 220, 0.5)',
				pointBorderWidth: 1,
				pointHoverRadius: 15,
				pointHoverBackgroundColor: 'rgba(220, 220, 220, 0.5)',
				pointHoverBorderColor: 'rgba(50, 50, 50, 1)',
				pointHoverBorderWidth: 5,
				pointRadius: 1,
				pointHitRadius: 15,
				data: this.props.get().map(o => (o.volumes)).reverse()
			}]
		}
		this.getData = this.getData.bind(this)
	}

	getData() {
		this.data.labels = this.props.get().map(o => (
			o.timestamp.slice(8, 10)+'/'+
			o.timestamp.slice(5, 7)+'/'+
			o.timestamp.slice(0, 4)
		)).reverse()
		for(let dataset in this.data.datasets) {
			this.data.datasets[dataset].data = this.props.get().map(o => (
				this.data.datasets[dataset].label==='Open'?
					o.open
				:this.data.datasets[dataset].label==='Low'?
					o.low
				:this.data.datasets[dataset].label==='High'?
					o.high
				:this.data.datasets[dataset].label==='Close'?
					o.close
				:
					o.volumes
			)).reverse()
		}
	}

	render() {
		this.getData()
		return (
			<div>
				<Line data={this.data} />
			</div>
		)
	}
}

export default Graph
