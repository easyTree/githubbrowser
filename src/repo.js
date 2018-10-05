import React, { Component } from 'react';
import ReadMe from './readMe';
import Watchers from './watchers';
import repoIcon from './icons/repo.svg';
import forks from './icons/forks.svg';
import pullRequests from './icons/pullRequests.svg'
import issues from './icons/issues.svg';
import stars from './icons/stars.svg';
import Stat from './stat';
import parse from 'parse-link-header';
import { getRepoUrl, getRepoWebUrls, fetchData } from './utils';
import { withHelpers } from './withHelpers';

class Repo extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.getPullRequestsCount(this.props.repo);
  }
  componentDidUpdate(prevProps) {
    if (this.props.repo.id !== prevProps.repo.id) {
      this.getPullRequestsCount(this.props.repo);
    }
  }
  getPullRequestsCount(repo) {
    const repoUrl = getRepoUrl(repo, '/pulls?per_page=1');
    fetchData(repoUrl)
      .then(this.props.helpers.checkResponse)
      .then(res => res.headers.get('link'))
      .then(link => link ? parse(link) : { last: { page: 0 } })
      .then(links => Number(links.last.page))
      .then(count => this.setState({
        pullRequestsCount: count,
        issuesCount: repo.open_issues_count - count
      }))
      .catch(this.props.helpers.handleErrors);
  }
  render() {
    const repo = this.props.repo;
    const urls = getRepoWebUrls(repo);

    return (
      <div>
        <h4 className='repo-name'>
          <img src={repoIcon} alt='repo' className='icon' height='32' />
          <a href={this.props.repo.html_url} rel='noreferrer noopener' target='_blank'>
            {this.props.repo.full_name}
          </a></h4>
        <h6 className='repo-desc'>
          {this.props.repo.description || '<no description>'}
        </h6>

        <div className='stat-group'>
          <a href={urls.issues}>
            <Stat src={issues} text='Issues' stat={this.state.issuesCount} />
          </a>
          <a href={urls.pulls}>
            <Stat src={pullRequests} text='Pull Requests' stat={this.state.pullRequestsCount} />
          </a>
          <a href={urls.watchers}>
            <Watchers repo={this.props.repo} />
          </a>
          <a href={urls.stars}>
            <Stat src={stars} text='Stars' stat={this.props.repo.stargazers_count} />
          </a>
          <a href={urls.forks}>
            <Stat src={forks} text='Forks' stat={this.props.repo.forks_count} />
          </a>

          <ReadMe repo={this.props.repo} />
        </div>
      </div>
    );
  }
}

export default withHelpers(Repo);
