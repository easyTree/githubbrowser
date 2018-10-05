import React, { Component } from 'react';
import ReactDom from 'react-dom';

class DetailView extends Component {
  ourElem() {
    return ReactDom.findDOMNode(this);
  }
  componentDidMount() {
    this.ourElem().addEventListener('click', this.clickHandler, false);
  }
  componentWillUnmount() {
    this.ourElem().removeEventListener('click', this.clickHandler, false);
  }
  clickHandler(e) {
    if (e.target.tagName.toLowerCase() === 'a') {
      e.target.setAttribute('target', '_blank');
    }
    else {
      const a = e.target.closest ? e.target.closest('a') : null;
      if (a) {
        a.setAttribute('target', '_blank');
      }
    }
  }
  render() {
    return (
      <div className='detail-view' {...this.props} />
    );
  }
}

export default DetailView;
