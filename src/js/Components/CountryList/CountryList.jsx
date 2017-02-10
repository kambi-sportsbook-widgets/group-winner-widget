import React, { PropTypes } from 'react';
import styles from './CountryList.scss';

const CountryList = ({ children, betOfferNames }) => (
   <table className={styles.general}>
      <thead>
         <tr className={styles.row}>
            <th />
            <th />
            {betOfferNames.map((betOfferName, i) =>
               <th key={i}>{betOfferName}</th>)}
         </tr>
      </thead>
      <tbody>{children}</tbody>
   </table>
);

CountryList.propTypes = {

   /**
    * Table rows
    */
   children: PropTypes.node,

   /**
    * List of bet offer names for table head
    */
   betOfferNames: PropTypes.arrayOf(PropTypes.string).isRequired

};

export default CountryList;
