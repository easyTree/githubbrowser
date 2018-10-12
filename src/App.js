import React, { Component } from 'react';
import {
  Route
} from 'react-router-dom';

import './App.css';
import github from './icons/github.svg';
import DetailView from './detailView';
import NavList2 from './navList2';
import Repo from './repo';
import PageContainer from './pageContainer';
import Header from './header';
import Rows from './rows';
import SearchBar from './searchBar';
import RateLimits from './rateLimits';
import {
  normalizeLimits,
  objectFind,
  updateLookup,
  getPageIndex,
  fetchData
} from './utils';
import HelpersContext from './withHelpers';
import MessageBox from './messageBox';
import { buildError, errorTypes } from './err';
import { matchPath } from 'react-router';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCount: 0,
      usableCount: 0,
      searchTerm: 'react',
      latestRateLimits: {},
      showColours: false,
      latestLimitReached: false
    };

    this.loaderRef = React.createRef();
    this.onSearchTermChanged = this.onSearchTermChanged.bind(this);
    this.onSearchGo = this.onSearchGo.bind(this);
    this.checkResponse = this.checkResponse.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.toggleColours = this.toggleColours.bind(this);
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadRows = this.loadRows.bind(this);

    this.helpers = {
      checkResponse: this.checkResponse,
      handleErrors: this.handleErrors
    };
  }

  checkResponse(res) {
    const latestRateLimits = normalizeLimits({
      limit: Number(res.headers.get('X-RateLimit-Limit')),
      remaining: Number(res.headers.get('X-RateLimit-Remaining')),
      reset: res.headers.get('X-RateLimit-Reset')
    });
    this.setState({ latestRateLimits });

    if (res.status === 403 && latestRateLimits.remaining === 0) {
      const err = buildError(errorTypes.apiRateLimited);
      throw err;
    }
    else if (!res.ok) {
      const err = buildError(errorTypes.other, `Status: ${res.status}\nStatusText: ${res.statusText}`);
      throw err;
    }
    return res;
  }
  handleErrors(err) {
    const line = ('-').repeat(60);
    if (err instanceof Object && err.__es6InheritanceTranspileFail__) {
      switch (err.errorType) {
        case errorTypes.apiRateLimited:
          const latestLimitReached = this.state.latestRateLimits
            && !!objectFind(
              this.state.latestRateLimits,
              (k, v) => k === 'remaining' && v === 0);
          this.setState({ latestLimitReached });

          break;
        case errorTypes.other:
          alert(err.message);
          break;
        default:
          break;
      }
    }
    if (err instanceof Error) {
      alert(`Error:\n${err.message}\n${line}\nStack trace:\n${err.stack}`);
    }
  }

  pageSize = 100
  threshold = this.pageSize - 1

  itemIndex = {}

  isRowLoaded({ index }) {
    return !!this.itemIndex[index];
  }
  loadRows({ startIndex, stopIndex }, callback) {
    // console.log(`loadRows({startIndex: ${startIndex}, stopIndex: ${stopIndex}}`);
    const count = stopIndex - startIndex + 1;
    if (count > this.pageSize) {
      // const msg = `rows ${startIndex}-${stopIndex}=${count}. We may not request more than one page (${this.pageSize}) of repos. `;
      // console.log(msg);
      stopIndex = startIndex + this.pageSize - 1;
      // console.log(`rewriting stopIndex to ${stopIndex}`);
      // throw Error(msg)
    }
    const startPage = getPageIndex(startIndex, this.pageSize);
    const stopPage = getPageIndex(stopIndex, this.pageSize);
    if (startPage !== stopPage) {
      throw Error(`startPage: ${startPage} 1== stopPage: ${stopPage}. We may not request more than one page at once.`)
    }

    const { searchTerm } = this.state;
    fetchData(`https://api.github.com/search/repositories?q=${searchTerm}&sort=stars&per_page=${this.pageSize}&page=${startPage}`)
      .then(this.helpers.checkResponse)
      .then(res => res.json())
      .then(resultSet => {
        updateLookup(resultSet.items, this.itemIndex, startIndex);
        this.setState((state, props) => ({
          totalCount: resultSet.total_count,
          usableCount: Math.min(1000, resultSet.total_count)
        }), callback);
      })
      .catch(this.handleErrors);

  }
  doSearch() {
    const { searchTerm } = this.state;
    if (searchTerm) {
      this.loadRows({
        startIndex: 0,
        stopIndex: this.pageSize - 1
      }, () => {
        const urlRepoId = this.getUrlRepoId();
        const urlRepo = this.getUrlRepo(urlRepoId);
        this.redirectIfNeeded(urlRepoId, urlRepo);
      })
    }
  }

  getUrlRepoId() {
    const match = matchPath(this.props.location.pathname, {
      path: '/repo/*',
      exact: true,
      strict: false
    });
    return match && match.params
      ? match.params[0]
      : undefined;
  }
  getUrlRepo(urlRepoId) {

    const a = this.itemIndex && urlRepoId
      ? objectFind(this.itemIndex, (idx, repo) => repo.full_name == urlRepoId) // eslint-disable-line eqeqeq
      : undefined;

    const currentUrlRepo = a ? a.v : undefined;
    return currentUrlRepo;
  }
  redirectIfNeeded(urlRepoId, urlRepo) {
    const shouldRedirect = this.itemIndex && urlRepoId && !urlRepo;

    if (shouldRedirect) {
      this.props.history.push("/");
    }
  }
  componentDidMount() {
    this.doSearch();
  }
  onSearchTermChanged(e) {
    this.setState({ searchTerm: e.target.value });
  }
  onSearchGo() {
    this.itemIndex = {};
    if (this.loaderRef.current) {
      this.loaderRef.current.resetLoadMoreRowsCache();
    }
    this.setState((state, props) => ({ totalCount: 0, usableCount: 0 }), () => {
      this.doSearch();
    });
  }

  toggleColours() {
    this.setState((state, props) => ({ showColours: !state.showColours }));
  }
  render() {
    const urlRepo = this.getUrlRepo(this.getUrlRepoId());

    return (
      <HelpersContext.Provider value={this.helpers}>
        <Rows showColours={this.state.showColours}>
          <Header>
            <img onClick={this.toggleColours} src={github} alt={'github logo'} className='icon' />

            <SearchBar
              searchText={this.state.searchTerm}
              onTextChanged={this.onSearchTermChanged}
              onSearch={this.onSearchGo}
            />
            <div className='spacer'></div>
            <RateLimits
              id='rateLimits'
              showPopover={this.state.latestLimitReached}
              latestRateLimits={this.state.latestRateLimits}
            />
          </Header>
          <PageContainer>
            <NavList2
              remoteRowCount={this.state.usableCount}
              list={this.itemIndex}
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.loadRows}
              batchSize={this.pageSize}
              threshold={this.threshold}
              activeId={urlRepo ? urlRepo.id : null}
              loaderRef={this.loaderRef}
            />
            <DetailView>
              {this.itemIndex && (
                <Route
                  path="/repo/*"
                  render={() => {
                    return (
                      urlRepo
                        ? <Repo repo={urlRepo} />
                        : ""
                    )
                  }}
                />
              )}
            </DetailView>
            <MessageBox title='API Limits' initiallyOpen={this.state.latestRateLimits.remaining === 0}>
              <p>The GitHub API limits have been reached and will be refreshed soon:</p>
              <RateLimits limits={this.state.latestRateLimits} />
            </MessageBox>
          </PageContainer>
        </Rows>
      </HelpersContext.Provider>
    );
  }
}

export default App;
