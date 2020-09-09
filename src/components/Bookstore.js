import React, { Component } from 'react'
import './Bookstore.scss'
import searchIcon from '../assets/search.png'
import Book from '../shared/components/BookComponent.js'

export default class Bookstore extends Component {

    query = ''

    updateQuery = (event) => {
        this.props.onQueryUpdate(event.target.value)
        this.query = event.target.value
    }

    render() {
        return (
            <div className="store-body flex-col">
                <div className="top flex-row">
                    <h1>Bookstore</h1>
                    <div className="search-container flex-row">
                        <img src={ searchIcon } alt="search" className="search-icon"/>
                        <input 
                            className="search-field" 
                            type="text" 
                            value={ this.props.query }
                            placeholder="Search for a book..." 
                            spellCheck="false"
                            onChange={ this.updateQuery } />
                    </div>
                </div>
                <div className="flex-col">
                    <span className="results" >Displaying { this.props.books.length } results for : 
                        <b>{ this.props.query }</b> 
                    </span>
                <span style={{
                        display: this.props.books.length > 0 ? "none" : "block"
                    }} className="error">{ this.props.error }</span>
                </div>
                <div className="flex-row book-holder">
                        {
                            this.props.books.map((book) => (
                                <Book 
                                    key={ book.id }
                                    book={ book } 
                                    inStore={ true }
                                    onNewBook={ this.props.onNewBook }
                                    onShelfChange={ this.props.onShelfChange } />
                            ))
                        }
                </div>
            </div>
        )
    }
}
