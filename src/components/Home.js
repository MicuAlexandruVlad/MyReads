import React, { Component } from 'react'
import './Home.scss'
import Book from '../models/Book.js'
import Navbar from './Navbar.js'
import Bookshelf from './Bookshelf.js'
import Bookstore from './Bookstore.js'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import * as $ from 'jquery'
import * as client from '../core/Api.js'

export default class Home extends Component {
    
    state = {
        searchQuery: '',
        currentlyReadingBooks: [],
        wantToReadBooks: [],
        readBooks: [],
        foundBooks: [],
    }

    async componentDidMount() {
        // if the component mounted I request all the saved books
        client.getAll().then((result) => {
            this.handleMyBooks(result)
        })

        // using local storage because the menu items on the left where not colored on reload
        const lastPage = localStorage.getItem("lastPage")
        if (lastPage === "bookshelf") {
            this.navBookshelf()
        }

        if (lastPage === "bookstore") {
            this.navBookstore()
        }
    }

    handleQueryChange = (query) => {
        // Whenever the query changes in the Bookstore component the state is changed
        this.setState({
            searchQuery: query
        }, this.handleBookSearch)
    }

    handleBookSearch = () => {
        if (this.state.searchQuery.length > 2) {
            client.search(this.state.searchQuery, 25).then((response) => {
                console.log(response)
                // if an array of objects is received -> start parsing the data
                if (response[0] !== undefined) {
                    let books = []
                    response.map((obj) => {
                        const book = new Book()

                        book.id = obj.id
                        book.name = obj.title
                        if (obj.authors !== undefined) {
                            book.author = obj.authors[0]
                        }
                        
                        if (obj.imageLinks !== undefined) {
                            book.url = obj.imageLinks.thumbnail
                        }
                        
                        // here i am looking to find the books from the search query in my saved books
                        // if a book matches i set the shelf accordingly, if not it is set to 0
                        // i use this in the Bookstore component to be able to change
                        // the shelf from the result page
                        if (obj.shelf === undefined) {
                            if (this.state.currentlyReadingBooks.filter(b => book.id === b.id).length > 0) {
                                book.shelf = 1
                            } else if (this.state.wantToReadBooks.filter(b => book.id === b.id).length > 0) {
                                book.shelf = 2
                            } else if (this.state.readBooks.filter(b => book.id === b.id).length > 0) {
                                book.shelf = 3
                            } else {
                                book.shelf = 0
                            }
                        }

                        books.push(book)
                    })

                    this.setState({
                        foundBooks: books
                    })
                }
                // console.log(response[0]);
            })
        } else {
            // if the query has less than 2 characters i reset the books array
            this.setState({
                foundBooks: []
            })
        }
    }

    // method that pushes all of the saved books to their corresponding array 
    // and then updates the state
    handleMyBooks(res) {
        let currentlyReading = []
        let wantToRead = []
        let read = []
        res.map((obj) => {
            const book = new Book()
            
            book.id = obj.id
            book.name = obj.title
            book.author = obj.authors[0]
            book.url = obj.imageLinks.thumbnail
            if (obj.shelf === 'currentlyReading') {
                book.shelf = 1
                currentlyReading.push(book)
            } else if (obj.shelf === 'wantToRead') {
                book.shelf = 2
                wantToRead.push(book)
            } else {
                book.shelf = 3
                read.push(book)
            }
        })

        this.setState({
            currentlyReadingBooks: currentlyReading,
            wantToReadBooks: wantToRead,
            readBooks: read,
        })
    }

    handleNewBook = (book, shelfIndex) => {
        console.log('New book from store')
        book.shelf = shelfIndex
        // when a new book is received i change this book's index so i can update the UI in the search page
        var fb = []
        for (let index = 0; index < this.state.foundBooks.length; index++) {
            const b = this.state.foundBooks[index];
            if (b.id === book.id) {
                b.shelf = shelfIndex
            }
            fb.push(b)
        }
        this.setState(({
            foundBooks: fb
        }))
        // adds the book to an array according to the shelfIndex value
        switch (shelfIndex) {
            case 1:
                client.update(book, "currentlyReading")
                this.setState(currentState => ({
                    currentlyReadingBooks: currentState.currentlyReadingBooks.concat(book)
                }))
                break;
            case 2:
                client.update(book, "wantToRead")
                this.setState(currentState => ({
                    wantToReadBooks: currentState.wantToReadBooks.concat(book)
                }))
                break;

            case 3:
                client.update(book, "read")
                this.setState(currentState => ({
                    readBooks: currentState.readBooks.concat(book)
                }))
                break;
        
            default:
                break;
        }
    }

    handleShelfChange = (book, newShelfIndex) => {
        console.log('Shelf change')
        console.log(JSON.stringify(book))
        console.log(newShelfIndex)

        this.changeShelf(book, newShelfIndex)
    }

    
    // changes the shelf of a book
    changeShelf(book, newShelfIndex) {
        var books = []
        if (book.shelf === 1) {
            books = this.state.currentlyReadingBooks.filter(arrayBook => arrayBook.id !== book.id)
            book.shelf = newShelfIndex
            if (newShelfIndex === 2) {
                client.update(book, "wantToRead")
                this.setState((currentState) => ({
                    currentlyReadingBooks: books,
                    wantToReadBooks: currentState.wantToReadBooks.concat(book)
                }))
                console.log(books.length)
            } else if (newShelfIndex === 3) {
                client.update(book, "read")
                this.setState((currentState) => ({
                    currentlyReadingBooks: books,
                    readBooks: currentState.readBooks.concat(book)
                }))
            }
        } else if (book.shelf === 2) {
            books = this.state.wantToReadBooks.filter(arrayBook => arrayBook.id !== book.id)
            book.shelf = newShelfIndex
            if (newShelfIndex === 1) {
                client.update(book, "currentlyReading")
                this.setState((currentState) => ({
                    wantToReadBooks: books,
                    currentlyReadingBooks: currentState.currentlyReadingBooks.concat(book)
                }))
            } else if (newShelfIndex === 3) {
                client.update(book, "read")
                this.setState((currentState) => ({
                    wantToReadBooks: books,
                    readBooks: currentState.readBooks.concat(book)
                }))
            }
        } else {
            books = this.state.readBooks.filter(arrayBook => arrayBook.id !== book.id)
            book.shelf = newShelfIndex
            if (newShelfIndex === 1) {
                client.update(book, "currentlyReading")
                this.setState((currentState) => ({
                    readBooks: books,
                    currentlyReadingBooks: currentState.currentlyReadingBooks.concat(book)
                }))
            } else if (newShelfIndex === 2) {
                client.update(book, "wantToRead")
                this.setState((currentState) => ({
                    readBooks: books,
                    wantToReadBooks: currentState.wantToReadBooks.concat(book)
                }))
            }
        }

        // if the book has its shelf changed from the Bookstore component 
        // i also change it in the foundBooks array so i can display a different
        // message in the shelf change dialog
        let f = this.state.foundBooks
        for (let index = 0; index < f.length; index++) {
            const b = f[index];
            if (b.id === book.id) {
                b.shelf = newShelfIndex
                break
            }
            
        }

        this.setState({
            foundBooks: f
        })
    }

    render() {
        return (
            <div className="home-body flex-row">
                <Navbar onStore={ this.onStore } onBookshelf = { this.onBookshelf } />

                <Router>

                    <Link id="bookshelfLink" to='/' ></Link>
                    <Link id="bookstoreLink" to='/search' ></Link>

                    <Route render={() => ( 
                        <Bookshelf 
                            wantToReadBooks={ this.state.wantToReadBooks }
                            readBooks={ this.state.readBooks }
                            currentlyReadingBooks={ this.state.currentlyReadingBooks }
                            onShelfChange={ this.handleShelfChange }
                            />
                    )} exact path='/' />
                    <Route render={() => (
                        <Bookstore 
                            books={ this.state.foundBooks }
                            onNewBook={ this.handleNewBook }
                            onShelfChange={ this.handleShelfChange }
                            query={ this.state.searchQuery }
                            onQueryUpdate={ this.handleQueryChange }  />
                    )} exact path='/search' />
                </Router>
            </div>
        )
    }

    onBookshelf = () => {
        this.navBookshelf()
    }

    onStore = () => {
        this.navBookstore()
    }

    navBookstore() {
        // $("#bookstore").click()
        $("#bookstoreLink")[0].click()
        localStorage.setItem("lastPage", "bookstore")
        this.changeStyle(1)
    }

    navBookshelf() {
        // $("#bookshelf").click()
        localStorage.setItem("lastPage", "bookshelf")
        $("#bookshelfLink")[0].click()
        this.changeStyle(0)
    }

    // target = 0 -> bookshelf
    // changes the style of the navbar items
    changeStyle(target) {
        const bookShelf = $("#bookshelf")
        const store = $("#bookstore")
        if (target === 0) {
            bookShelf.addClass('active')
            store.removeClass('active')
        } else {
            bookShelf.removeClass('active')
            store.addClass('active')
        }
    }
}

