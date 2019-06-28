import React, { Component } from 'react'
import { Index } from 'elasticlunr'
import { Link } from 'gatsby'
import './search.css'

// Search component
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ``,
      results: [],
    }
  }

  render() {
    return (
      <div className="SearchWrapper">
        <input
          className="SearchInput"
          placeholder="Søk"
          type="text"
          value={this.state.query}
          onChange={this.search}
        />
        {this.state.results.length > 0 ? (
          <ul>
            {this.state.results.map((page) => (
              <li key={page.id}>
                <Link
                  to={
                    '/' +
                    (!page.tabs
                      ? page.slug.substr(
                          0,
                          page.slug.lastIndexOf(page.currentPage),
                        )
                      : page.slug)
                  }
                >
                  {page.searchTitle || page.title}
                  {page.tabs ? ': ' + page.currentPage : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }
  getOrCreateIndex = () =>
    this.index ? this.index : Index.load(this.props.searchIndex)

  search = (evt) => {
    const query = evt.target.value
    this.index = this.getOrCreateIndex()
    this.setState({
      query,
      results: this.index
        .search(query, {})
        .map(({ ref }) => this.index.documentStore.getDoc(ref)),
    })
  }
}
