import React, { Component } from 'react';
import watchers from './icons/watchers.svg'
import Stat from './stat';
import { getRepoUrl, fetchData } from './utils';
import { withHelpers } from './withHelpers';

class Watchers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getWatchers();
  }
  componentDidUpdate(prevProps) {
    if (this.props.repo.id !== prevProps.repo.id) {
      this.getWatchers();
    }
  }
  getWatchers() {
    const repo = this.props.repo;
    const repoUrl = getRepoUrl(repo, '');
    fetchData(repoUrl)
      .then(this.props.helpers.checkForErrors)
      .then(this.props.helpers.updateLimits)
      .then(res => res.json())
      .then(json => this.setState({ subscribersCount: json.subscribers_count }))
      .catch(this.props.helpers.handleErrors);
  }

  render() {
    return (
      <Stat src={watchers} text='Watchers' stat={this.state.subscribersCount} />
    );
  }
}

export default withHelpers(Watchers);
