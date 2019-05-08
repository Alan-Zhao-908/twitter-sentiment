import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import Search from './components/Search.jsx';

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      input: ['hi', 'hello'],
      tweets: [],
      adjectives: []
    };
    // you might have to do something important here!
  }

  componentDidMount() {

  }

  getTweets(query) {
    this.setState({
      input: query
    })
    axios.get(`/tweets/${query}`)
    .then(result => {
      this.setState({
        tweets: result.data,
        adjectives: []
      })
    })
  }
  renderTweets() {
    const {tweets} = this.state;
      if (tweets.length === 0) {
        return null;
      }
      return (

        <div>
          <h2>Tweets</h2>
          <ul>
            {tweets.map(function(item){
               return (<li key={item}>{item}</li>)
            })}
          </ul>
        </div>
      )
  }

  getAdjectives() {
    let load = this.state.tweets
    axios.post('/adjectives', {tweets: load})
    .then(result => {
      console.log(result.data)
      this.setState({
        adjectives: result.data
      })
    })
  }

  renderAdjectives() {
    const {adjectives} = this.state;
    console.log(adjectives[0])
      if (adjectives.length === 0) {
        return null;
      }
      return (

        <div>
          <h2>Tweet Adjectives</h2>
          <ul>
            {adjectives.map(function(item,i){
               return (<li key={i}>{item}</li>)
            })}
          </ul>
        </div>
      )
  }

  render () {
  	return (
      <div className="app">
        <header className="navbar"><h1>Tweet Sentiment</h1></header> 
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <Search handleSearchInputChange={this.getTweets.bind(this)} />
          </div>
        </div>

        
        <div className="main">
          <div>
            {this.renderTweets.call(this)}
          </div>
        </div>
        <button className="btn hidden-sm-down" onClick={this.getAdjectives.bind(this)}>
          <span className="glyphicon glyphicon-search">Calculate Adjectives</span>
        </button>
        <div>
            {this.renderAdjectives.call(this)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('twitter'));