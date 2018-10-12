import React, { Component } from 'react';
import { getRepoUrl, fetchData, b64DecodeUnicode } from './utils';
import readme from './icons/readme.svg';
import {
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import { withHelpers } from './withHelpers';

class ReadMe extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getReadMe();
  }

  componentDidUpdate(prevProps) {
    if (this.props.repo.id !== prevProps.repo.id) {
      this.getReadMe();
    }
  }

  getReadMe() {
    const repo = this.props.repo;
    const readMeUrl = getRepoUrl(repo, '/readme');
    fetchData(readMeUrl)
      .then(this.props.helpers.checkResponse)
      .then(res => res.json())
      .then(readMe => {
        const markdownUrl = `https://api.github.com/markdown`;

        const params = {
          method: 'POST',
          headers: {
            'Accept': 'text/html',
            'Accept-Charset': 'utf-8',
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify({
            text: b64DecodeUnicode(readMe.content),
            mode: 'gfm',
            context: `${repo.owner.login}/${repo.name}`
          })
        };
        fetchData(markdownUrl, params)
          .then(this.props.helpers.checkResponse)
          .then(res => res.text())
          .then(html => this.setState({ readMe: html }))
          .catch(this.props.helpers.handleErrors);
      })
      .catch(this.props.helpers.handleErrors);
  }

  render() {
    return (
      <div className='read-me'>
        <Card>
          <CardHeader>
            <img src={readme} alt='readme' className='icon' height='32' />
            README.md
          </CardHeader>
          <CardBody>
            {this.state && this.state.readMe && (
              <div dangerouslySetInnerHTML={{ __html: this.state.readMe }}></div>
            )}
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default withHelpers(ReadMe);
