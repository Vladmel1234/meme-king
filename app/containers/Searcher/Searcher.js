import _ from 'lodash';
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import classNames from 'classnames'

// actions
import {fetchSearchResults, cleanSearchResults} from 'actions/search-actions/search-actions'

// components
import MemeThumb from 'components/MemeThumb/MemeThumb'
import SearchInput from 'components/SearchInput/SearchInput'

// constants
import globalConstants from 'constants/global'

// helpers
import helpers from 'helpers/helpers'

// services
import AnalyticsService from 'services/Analytics'

class Searcher extends Component {

    constructor(props) {
        super(props)
        this.state = {
            active: false,
            value: _.get(props, 'query.search') || ''
        }
    }

    clearResults = () => {

        this.setState({ active: false, value: '' })
        this.props.cleanSearchResults()
    }

    onSearch = _.debounce((value) => {
        if (value.length >= 3) {
            this.props.fetchSearchResults(value)

            this.handleGoogleAnalytics(value)
            this.setState({ active: true })
        } else if (!value) {
            this.setState({ active: false })
            this.props.cleanSearchResults(value)
        } else {
            this.setState({ active: false })
        }

    }, 300, false)

    openGenerator = (e, meme) => {
        e.preventDefault()
        const location = {
            pathname: `/generator/upload/${globalConstants.format.normal}`,
            state: { urlPath: meme.urlPath, from: 'search' },
            query: { search: this.state.value }
        }
        this.props.history.push(location)
    };

    onChange = (value) => {
        this.setState({ value })
        this.onSearch(value)
    }

    handleGoogleAnalytics = _.once((value) => {
        AnalyticsService.sendEvent('Search', value)
    })


    render() {

        const { searchResults, isFetching } = this.props
        const { active } = this.state
        const showNoMemesMessage = (!_.size(searchResults) && active && !isFetching )

        return (
            <div className={classNames('searcher', active && 'active')}>
                <SearchInput onChange={this.onChange}
                             clearResults={this.clearResults}
                             isFetching={isFetching}
                             value={this.state.value}
                />
                {!_.isEmpty(searchResults) && (
                    <p className="number_of_memes_found">
                        {`(${searchResults.length})`}
                    </p>
                )}
                <div className={classNames('results-wrapper', { 'active': !_.isEmpty(searchResults) })} ref={node => this.resultsWrapper = node}>
                    { _.map(searchResults, (meme) =>
                        <MemeThumb width={helpers.isMobile() ? 33 : 12.5}
                                   key={meme.id}
                                   {...meme}
                                   urlLinkDisabled
                                   onClick={(e) => this.openGenerator(e, meme)}
                                   category={meme.category}
                        />
                    )}

                </div>
                { showNoMemesMessage && (
                    <p className="text-center">
                        לא נמצאו ממים מתאימים
                    </p>
                )}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        searchResults: state.search.searchResults,
        isFetching: state.search.isFetching,
        query: _.get(ownProps, 'history.location.query') || {},
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchSearchResults, cleanSearchResults }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Searcher)