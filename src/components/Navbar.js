import React, { Component } from 'react'
import './Navbar.scss'
import booksIcon from  '../assets/books.png'
import storeIcon from  '../assets/store.png'

import * as $ from 'jquery'

export default class Navbar extends Component {

    onBookshelf() {
        this.changeStyle(0)
        this.props.onBookshelf()
    }

    onStore() {
        this.changeStyle(1)
        this.props.onStore()
    }

    // target = 0 -> bookshelf
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

    render() {
        return (
            <div className="body flex-col">
                <div onClick={ () => { this.onBookshelf() } } id="bookshelf" className="icon-holder flex-col">
                    <img src={ booksIcon } className="nav-icon"/>
                    <span className="icon-title">Bookshelf</span>
                </div>
                <div onClick={ () => { this.onStore() } } id="bookstore" className="icon-holder flex-col">
                    <img src={ storeIcon } className="nav-icon"/>
                    <span className="icon-title">Store</span>
                </div>
            </div>
        )
    }
}
