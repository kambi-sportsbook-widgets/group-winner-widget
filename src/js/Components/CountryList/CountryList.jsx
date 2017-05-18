import React from 'react';
import PropTypes from 'prop-types';
import styles from './CountryList.scss';

const CountryList = ({ children }) => (
   <ul className={styles.general}>
      {children}
   </ul>
);

CountryList.propTypes = {

   /**
    * Table rows
    */
   children: PropTypes.node,

};

export default CountryList;
