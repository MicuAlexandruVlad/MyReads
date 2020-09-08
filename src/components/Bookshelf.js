import React, { Component } from 'react'
import './Bookshelf.scss'
import Book from '../shared/components/BookComponent.js'

export default class Bookshelf extends Component {
    render() {
        return (
            <div className="bookshelf-body">
                <div className="section flex-col">
                    <h1 className="section-title">Currently Reading</h1>
                    <div className="flex-row book-holder">
                        { 
                            this.props.currentlyReadingBooks.map((book) => {
                                return <Book 
                                            key={ book.id }
                                            book={ book } 
                                            onShelfChange={ this.props.onShelfChange }
                                            inStore={ false } />
                            })
                        }
                    </div>
                </div>
                <div className="section flex-col">
                    <h1 className="section-title">Want to Read</h1>
                    <div className="flex-row book-holder">
                        { 
                            this.props.wantToReadBooks.map((book) => {
                                return <Book 
                                            key={ book.id }
                                            book={ book } 
                                            onShelfChange={ this.props.onShelfChange }
                                            inStore={ false } />
                            })
                        }
                    </div>
                </div>
                <div className="section flex-col">
                    <h1 className="section-title">Read</h1>
                    <div className="flex-row book-holder">
                        { 
                            this.props.readBooks.map((book) => {
                                return <Book 
                                            key={ book.id }
                                            book={ book } 
                                            onShelfChange={ this.props.onShelfChange }
                                            inStore={ false } />
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
