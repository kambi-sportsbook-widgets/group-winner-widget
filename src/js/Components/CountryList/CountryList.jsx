import React, { PropTypes } from 'react';
import styles from './CountryList.scss';

const CountryList = ({ children }) => (
   <table className={styles.general}>
      <tbody>{children}</tbody>
   </table>
);

CountryList.propTypes = {

   /**
    * Table rows
    */
   children: PropTypes.node,

};

export default CountryList;
