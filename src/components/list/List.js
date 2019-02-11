import React from 'react';
import { handleResponse } from '../../helpers';
import Loading from '../common/Loading';
import Table from './Table';
import Pagination from './Pagination';


class List extends React.Component{
    constructor(){
        super();

        this.state = {
            loading: false,
            currencies: [],
            error: null,
            totalPages: 0,
            page: 1
        }

        this.handlePaginationClick =  this.handlePaginationClick.bind(this);
    }

    componentDidMount(){
        this.fetchCurrencies()
    }

    fetchCurrencies(){
        this.setState({loading: true});

        const { page } = this.state;

        fetch(`https://api.udilia.com/coins/v1/cryptocurrencies?page=${page}&perPage=20`)
        .then(handleResponse)
        .then((data) => {
            const {currencies, totalPages}=data;
            
            this.setState({loading: false, currencies: currencies, totalPages: totalPages});
        })
        .catch((error) => {
            console.log('Error', error);
            this.setState({loading: false, error: error.errorMessage || 'Something went wrong'});
        });
    }

    handlePaginationClick(direction){
        let nextPage = this.state.page;

        nextPage = (direction === 'next') ? ++nextPage : --nextPage;
        this.setState({page: nextPage}, () => {
            this.fetchCurrencies();
        })
    }

    render(){
        const { loading, error, currencies, page, totalPages } = this.state;
        
        if (loading){
            return <div className="loading-container"><Loading /></div>
        }
        
        if (error){
            return <div className="error">{ error }</div>
        }

        return (
            <div>
                <Table currencies={currencies} />
                <Pagination page={page} totalPages={totalPages} handlePaginationClick={this.handlePaginationClick} />
            </div>
        )
    }
}

export default List;
