
// This is the conrolled component solution
// https://facebook.github.io/react/docs/forms.html#controlled-components
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  handleInputChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  changeInputMaster(e) {
    this.props.handleSearchInputChange(this.state.value);
    event.preventDefault();
    this.setState({
      value: ''
    })
  }

  render() {
    return (
      <form onSubmit={this.changeInputMaster.bind(this)}>
        <div className="search-bar form-inline">
          <input
            className="form-control"
            type="text"
            value={this.state.value}
            onChange={this.handleInputChange.bind(this)}
          />
        </div>
      </form>
    );
  }
}


// In the ES6 spec, files are "modules" and do not share a top-level scope
// `var` declarations will only exist globally where explicitly defined
export default Search;
