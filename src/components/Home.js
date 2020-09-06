import React, { Component } from 'react'
import './Home.scss'
import Navbar from './Navbar.js'
import Bookshelf from './BookList.js'
import Bookstore from './BookSearch'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import * as $ from 'jquery'

export default class Home extends Component {

    componentDidMount() {
        this.navBookshelf()
    }

    onBookshelf = () => {
        console.log('Bookshelf clicked')
        this.navBookshelf()
    }

    onStore = () => {
        console.log('Store clicked')
        this.navBookstore()
    }

    render() {
        return (
            <div className="body flex-row">
                <Navbar onStore={ this.onStore } onBookshelf = { this.onBookshelf } />

                <Router>

                    <Link id="bookshelfLink" to='/bookshelf' ></Link>
                    <Link id="bookstoreLink" to='/bookstore' ></Link>

                    <Route render={() => ( 
                        <Bookshelf />
                    )} exact path='/bookshelf' />
                    <Route render={() => (
                        <Bookstore  />
                    )} exact path='/bookstore' />
                </Router>
            </div>
        )
    }

    navBookstore() {
        $("#bookstore").click()
        $("#bookstoreLink")[0].click()
    }

    navBookshelf() {
        $("#bookshelf").click()
        $("#bookshelfLink")[0].click()
    }
}
