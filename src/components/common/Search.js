import React from 'react';
import { withRouter } from 'react-router-dom'
import Loading from './Loading'
import { API_URL } from '../../config'
import { handleResponse } from '../../helpers'
import './Search.css';

class Search extends React.Component {
    constructor(){
        super();

        this.state = { searchQuery: '', loading: false, searchResults: [], showResultContainer: false }

        this.handleChange = this.handleChange.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    handleChange(event){
        const searchQuery = event.target.value;

        this.setState( { searchQuery } )

        if (!searchQuery){
            return ''
        }

        this.setState( { loading: true } )

        fetch(`${API_URL}/autocomplete?searchQuery=${searchQuery}`)
        .then(handleResponse)
        .then((result) => {
            this.setState( { loading: false, searchResults: result } )
        })
    }

    showResultsContainer(showResultContainer, wait = 0){
        setTimeout(() => {
            this.setState( { showResultContainer })
        }, (wait * 200))
    }


    handleRedirect(currencyId){
        this.setState({
            searchQuery: '',
            searchResults: []
        })

        this.props.history.push(`/currency/${currencyId}`);
    }

    rendersearchResults(){
        const { searchResults, searchQuery, loading, showResultContainer } = this.state

        if (!searchQuery) return ''
        if (!showResultContainer) return ''

        if(searchResults.length > 0){
            return (
                <div className="Search-result-container">
                    { searchResults.map((result) => {
                        return (
                            <div key={result.id} className="Search-result" onClick={() => this.handleRedirect(result.id)}>
                                {result.name} ({result.symbol})
                            </div>
                        )
                    }) }
                </div>
            )
        }

        if (!loading){
            return (
                <div className="Search-result-container">
                    <div className="Search-no-result">
                        No result found.
                    </div>
                </div>
            )
        }
    }

  render (){
      const { loading, searchQuery } = this.state;
    return (
        <div className="Search">
            <span className="Search-icon" />
            <input className="Search-input" type="text" placeholder="Currency name" value={searchQuery} onChange={this.handleChange} 
                onBlur={() => this.showResultsContainer(false, 1)} onFocus={() => this.showResultsContainer(true)} />

            { loading && <div className="Search-loading">
                <Loading width="12px" height="12px" />
            </div> }

            {this.rendersearchResults()}
        </div>
    )
  }
}

export default withRouter(Search);
