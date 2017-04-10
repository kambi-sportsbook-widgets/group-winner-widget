import React, { PropTypes } from 'react';
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
