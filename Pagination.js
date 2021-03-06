// eslint-disable-next-line max-len
/* eslint-disable prefer-destructuring,no-lonely-if,jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events, react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import classes from './Pagination.css';

class Pagination extends Component {
  state = {
    pager: {}
  };

  componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }

  setPage = page => {
    const items = this.props.items;
    let pager = this.state.pager;

    if (page < 1 || page > pager.totalPages) {
      return;
    }

    // get new pager object for specified page
    pager = this.getPager(items.length, page);

    // get new page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // update state
    this.setState({ pager });

    // call change page function in parent component
    this.props.onChangePage(pageOfItems);
  };

  getPager = (totalItems, currentPage = 1, pageSize = this.props.pageSize) => {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    let startPage;
    let endPage;

    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + (pageSize - 1), totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages
    };
  };

  render() {
    const pager = this.state.pager;

    if ((!pager.pages || pager.pages.length <= 1) && this.props.displayForOnePage) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
      <ul className={classes.Pagination}>
        <li className={pager.currentPage === 1 ? classes.Disabled : null}>
          <a onClick={() => this.setPage(1)}>&#171;</a>
        </li>
        <li className={pager.currentPage === 1 ? classes.Disabled : null}>
          <a onClick={() => this.setPage(pager.currentPage - 1)}>&#60;</a>
        </li>
        <li className={classes.Numbers}>
          <ul>
            {
              pager.pages.map((page, index) => (
                <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                  <a onClick={() => this.setPage(page)}>{page}</a>
                </li>
              ))
            }
          </ul>
        </li>
        <li className={pager.currentPage === pager.totalPages ? classes.Disabled : null}>
          <a onClick={() => this.setPage(pager.currentPage + 1)}>&#62;</a>
        </li>
        <li className={pager.currentPage === pager.totalPages ? classes.Disabled : null}>
          <a onClick={() => this.setPage(pager.totalPages)}>&#187;</a>
        </li>
      </ul>
    );
  }
}

Pagination.propTypes = {
  items: PropTypes.arrayOf().isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
  displayForOnePage: PropTypes.bool
};

Pagination.defaultProps = {
  initialPage: 1,
  pageSize: 10,
  displayForOnePage: true
};

export default Pagination;
