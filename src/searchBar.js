import React, { Component } from 'react';
import { Button, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import search from './icons/search.svg';

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.keyPress = this.keyPress.bind(this);
    }
    keyPress(e) {
        if (e.target.type !== 'textarea' && e.which === 13) {
            e.preventDefault();
            this.props.onSearch();
        }
    }
    render() {
        return (
            <span className='search-bar'>
                <Form inline onKeyPress={this.keyPress}>
                    <InputGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            type="text"
                            name="repoText"
                            id="repoText"
                            placeholder="search repo name"
                            onChange={this.props.onTextChanged}
                            value={this.props.searchText}
                        />
                        <InputGroupAddon addonType="append">
                            <Button
                                color="#ced4da"
                                onClick={this.props.onSearch}
                            >
                                <img id='searchButton' src={search} height='18' alt='search' />
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>
            </span>
        );
    }
}




