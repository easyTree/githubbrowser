import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router'

class NavListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    this.ensureVisible();
  }
  componentDidUpdate(prevProps, prevState) {
    // this.ensureVisible();
  }
  ensureVisible() {
    if (this.props.active) {
      findDOMNode(this).scrollIntoView();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.repo !== nextProps.repo || this.props.active !== nextProps.active;
  }
  render() {
    const props = this.props;
    const classes = ['sidebar-list-item'];
    if (this.props.active) {
      classes.push('active');
    }
    const classStr = classes.join(' ');
    return props.repo
      ? (
        <Link to={`/repo/${props.repo.full_name}`} className={classStr}>
          {props.index + 1}{')'} {props.repo.full_name}
        </Link>
      )
      : (
        <span></span>
      );
  }
}

export default withRouter(NavListItem)
