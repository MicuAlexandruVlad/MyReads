import React, { Component } from 'react'
import './Book.scss'
import menuIcon from '../../assets/menu.png'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class BookComponent extends Component {

    state = {
        dialogOpen: false
    }

    //options: 1 -> Currently Reading, 2 -> Want to Read, 3 -> Read

    handleClose(option) {
        // if there was an option selected i check to see if the dialog was opened from the Bookstore or not
        // if not, onShelfChange is called, otherwise i check for the shelf value: if it is 0 the book
        // is not added to any shelf, if it is != 0 then the shelf needs to be changed
        if (option !== undefined) {
            if (!this.props.inStore) {
                this.props.onShelfChange(this.props.book, option)
            } else {
                if (this.props.book.shelf === 0) {
                    this.props.onNewBook(this.props.book, option)
                } else {
                    this.props.onShelfChange(this.props.book, option)
                }
            }
        }
        this.setState({
            dialogOpen: false
        })
    }

    handleOpen() {
        this.setState({
            dialogOpen: true
        })
    }

    render() {
        return (
            <div className="book-body flex-col">
                <div className="book-cover-holder">
                    <div onClick={ () => this.handleOpen() } className="menu">
                        <img src={ menuIcon } alt="menu" className="menu-icon"/>
                    </div>
                    <Dialog
                        open={ this.state.dialogOpen }
                        onClose={ () => this.handleClose() }
                        maxWidth="xs"
                        >
                        <DialogTitle 
                            hidden={ this.props.book.shelf === 0 ? true: false } 
                            className="dialog-title">{ `Change shelf for ${ this.props.book.name }` }
                        </DialogTitle>
                        <DialogTitle 
                            hidden={ this.props.book.shelf !== 0 ? true: false }
                            className="dialog-title">{ `Add ${ this.props.book.name } to bookshelf` }
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Choose one of the options below:
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <div className="flex-col actions-holder">
                                    <div onClick={ () => this.handleClose(1) } className="dialog-action flex-row">
                                        <span>Currently Reading</span>
                                    </div>
                                    <div onClick={ () => this.handleClose(2) } className="dialog-action flex-row">
                                        <span>Want to Read</span>
                                    </div>
                                    <div onClick={ () => this.handleClose(3) } className="dialog-action flex-row">
                                        <span>Read</span>
                                    </div>
                                </div>
                            </DialogActions>
                    </Dialog>
                    <img className="book-cover" src={ this.props.book.url }/>
                </div>
                <span className="book-title">{ this.props.book.name }</span>
                <span className="book-author">{ this.props.book.author }</span>
            </div>
        )
    }
}
