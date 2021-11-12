import React from 'react';
import './App.css';

const ms = require('pretty-ms');

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      break: 0, // 0 is for not in use, 1 is in use, -1 is paused
      breaktime: 5 * 1000 * 60,
      time: 25 * 1000 * 60,
      isOn: false,
      start: 1000,
      breakValue: 5,
      sessionValue: 25
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }

  startTimer() {
    if(this.state.isOn === false) {
      this.setState({
        isOn: true,
        time: this.state.time,
        start: 1000,
        breaktime: this.state.breaktime
      })
      this.timer = setInterval(() => this.setState({
        time: this.state.time === 0 ? this.aftersession() : this.state.time - this.state.start
      }), 1000);
    }
  }
  stopTimer() {
    if(this.state.break === 0 && this.state.isOn === false) {
      this.setState({time: this.state.time, breaktime: this.state.breaktime});
      clearInterval(this.timer);
      clearInterval(this.timer2);
    } else if (this.state.isOn === true) {
      this.setState({time: this.state.time, isOn: false});
      clearInterval(this.timer);
    } else if (this.state.break === 1) {
      this.setState({breaktime: this.state.breaktime, break: -1});
      clearInterval(this.timer2);
    }
  }
  resetTimer() {
    this.setState({time: 25 * 1000 * 60, isOn: false, break: 0, breaktime: 5 * 1000 * 60, breakValue: 5, sessionValue: 25});
    clearInterval(this.timer);
    clearInterval(this.timer2);
  }
  aftersession() {
    this.setState({breaktime: this.state.breaktime, isOn: false});
    clearInterval(this.timer);
    this.breaktimer();
    return 0;
  }

  breaktimer() {
    if(this.state.break === -1 || this.state.break === 0) {
      this.setState({
        isOn: false,
        time: this.state.time,
        start: 1000,
        breaktime: this.state.breaktime,
        break: 1
      })
      this.timer2 = setInterval(() => this.setState({
        breaktime: this.state.breaktime === 0 ? this.afterbreak() : this.state.breaktime - this.state.start
      }), 1000);
    }
  }

  afterbreak() {
    this.setState({isOn: false, break: 0, breaktime: this.state.breakValue * 1000 * 60, time: this.state.sessionValue * 1000 * 60});
    clearInterval(this.timer2);
    this.startTimer();
    return 0;
  }

  breakIncrement() {
    if(this.state.breakValue > 0 && this.state.breakValue <= 59 && this.state.isOn === false && this.state.break === 0) {
      this.setState({breakValue: this.state.breakValue + 1, breaktime: (this.state.breakValue+1) * 1000 * 60});
    }
  }

  breakDecrement() {
    if(this.state.breakValue > 1 && this.state.breakValue <= 60 && this.state.isOn === false && this.state.break === 0) {
      this.setState({breakValue: this.state.breakValue - 1, breaktime: (this.state.breakValue-1) * 1000 * 60});
    }
  }

  sessionIncrement() {
    if(this.state.sessionValue > 0 && this.state.sessionValue <= 59 && this.state.isOn === false && this.state.break === 0) {
      this.setState({sessionValue: this.state.sessionValue + 1, time: (this.state.sessionValue + 1) * 1000 * 60 });
    }
  }

  sessionDecrement() {
    if(this.state.sessionValue > 1 && this.state.sessionValue <= 60 && this.state.isOn === false && this.state.break === 0) {
      this.setState({sessionValue: this.state.sessionValue - 1, time: (this.state.sessionValue - 1) * 1000 * 60});
    }
  }

  

  render() {
    let start = <p><i className="fa fa-play white-text" onClick={this.startTimer}></i></p>
    let stop = <p><i className="fa fa-pause white-text" onClick={this.stopTimer}></i></p>
    //let resume = <button onClick={this.startTimer}>resume</button>
    let reset = <p><i className="fa fa-refresh white-text" onClick={this.resetTimer}></i></p>
    
    return (
      <div className="container">
		    <div className="row">
			    <center><h1 className="white-text">25 + 5 Clock</h1></center>
		    </div>
		    <div className="row m-t-40">
			    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
				    <h3 className="white-text right" id="break-label">Break Length</h3>
				    <br />
				    <p className="right m-r-50"><i className='fa fa-arrow-up white-text' id="break-increment" onClick={() => this.breakIncrement()}></i></p>
            <p className="white-text right m-r-50" id="break-length">{this.state.breakValue}</p>
				    <p className="right m-r-50"><i className='fa fa-arrow-down white-text' id="break-decrement" onClick={() => this.breakDecrement()}></i></p>
			    </div>
			    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
				    <h3 className="white-text" id="session-label">Session Length</h3>
				    <br />
				    <p className="m-l-50"><i className='fa fa-arrow-up white-text' id="session-increment" onClick={() => this.sessionIncrement()}></i></p>
				    <p className="white-text m-l-50" id="session-length">{this.state.sessionValue}</p>
				    <p className="m-l-50"><i className='fa fa-arrow-down white-text' id="session-decrement" onClick={() => this.sessionDecrement()}></i></p>
			    </div>
		    </div>
		    <div className="row">
			    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>
				    <center>
					    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 box">
						    <h3 className="white-text" id="timer-label">{this.state.break === 0 ? "Session" : "Break"}</h3>
						    <h2 className="white-text" id="time-left">{(this.state.break === 1 || this.state.break === -1) ? ms(this.state.breaktime, {colonNotation: true}) : ms(this.state.time, {colonNotation: true})}</h2>
					    </div>
				    </center>
			    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>
		    </div>
		    <div className="row">
			    <center>
            {start}
            {stop}
            {reset}
			    </center>
		    </div>
	    </div>
    );
  }
}

export default App;