import React, { Component } from 'react';
import moment from 'moment';
import { Badge, Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import {
  getRateLimitUrl,
  normalizeLimits,
  objectMap,
  pascalCase,
  fetchData
} from './utils';
import { withHelpers } from './withHelpers';

class RateLimits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      lockedOpen: false,
      limitData: {}
    }
    this.clicked = this.clicked.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getMoreInfo = this.getMoreInfo.bind(this);
  }

  componentDidMount() {
    if (this.props.showPopover) {
      this.clicked();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.showPopover 
      && !this.state.popoverOpen 
      && !this.state.lockedOpen
      && !prevProps.showPopover
    ) {
      this.clicked();
    }
  }
  clicked() {
    this.getMoreInfo();
    this.setState((state, props) => ({
      lockedOpen: !state.lockedOpen,
      popoverOpen: !state.lockedOpen
    })
      // , () => {
      //   if (!this.state.lockedOpen) {
      //     this.props.limitsUiClosed();
      //   }
      // }
    );
  }
  toggle() {
    this.setState((state, props) => ({ popoverOpen: !state.popoverOpen }));
  }
  getMoreInfo() {
    fetchData(getRateLimitUrl())
      .then(this.props.helpers.checkResponse)
      .then(res => res.json())
      .then(json => objectMap(json.resources, (k, l) => normalizeLimits(l)))
      .then(limitData => this.setState({ limitData }))
      .catch(this.props.helpers.handleErrors);
  }
  render() {
    const popoverId = 'Popover-' + this.props.id;
    return (
      <span
        id={popoverId}
        className='limits compact'
        onClick={this.clicked}
      >
        <Badge color="secondary" pill>{this.props.latestRateLimits.remaining}</Badge>
        <span className='sep'>/</span>
        <Badge color="secondary" pill>{this.props.latestRateLimits.limit}</Badge>
        <Popover placement="bottom" isOpen={this.state.popoverOpen || this.state.lockedOpen} target={popoverId} toggle={this.toggle}>
          <PopoverHeader>GitHub API Credits</PopoverHeader>
          <PopoverBody>
            <div className='popover-content'>
              {
                this.state.limitData
                  ? <Expanded limitData={this.state.limitData} />
                  : <Standard limits={this.props.latestRateLimits} />
              }
            </div>
            <Button onClick={this.getMoreInfo}>Refresh...</Button>
          </PopoverBody>
        </Popover>
      </span>
    )
  }
}

const Standard = props => {
  const limits = props.limits;
  const className = `limits${limits.remaining === 0 && limits.limit > 0 ? ' expired' : ''}`;
  return (
    <div className={className}>
      {limits.remaining} of {limits.limit} remaining;
      resets <span>{moment(limits.reset).fromNow()}</span>
    </div>
  )
}

class Expanded extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const limitData = this.props.limitData;
    return (
      <table className="limit-data"><tbody>
        {Object.keys(limitData).map((key) =>
          <tr key={key}>
            <td>{pascalCase(key)}</td>
            <td><Standard limits={limitData[key]} /></td>
          </tr>
        )}
      </tbody></table>
    )
  }
}

export default withHelpers(RateLimits);
