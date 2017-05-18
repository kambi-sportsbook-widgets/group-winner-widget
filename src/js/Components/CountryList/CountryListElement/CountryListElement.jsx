import React from 'react';
import PropTypes from 'prop-types';
import { OutcomeButton } from 'kambi-widget-components';
import styles from './CountryListElement.scss';

const CountryListElement = ({ country, outcome, flagUrl, onClick }) => {
   return (
      <li className={styles.row}>
         <div className={styles.flag} onClick={onClick}>
            <img role='presentation' src={flagUrl} />
         </div>
         <div className={styles.country} onClick={onClick}>
            {country}
         </div>
         <div className={styles.button}>
            <OutcomeButton outcome={outcome} label={false} />
         </div>
      </li>
   );
};

CountryListElement.propTypes = {

   /**
    * Country name
    */
   country: PropTypes.node.isRequired,

   /**
    * Country flag url
    */
   flagUrl: PropTypes.string.isRequired,

   /**
    * Outcome for this country
    */
   outcome: PropTypes.object.isRequired,

   /**
    * Row click callback
    */
   onClick: PropTypes.func.isRequired

};

export default CountryListElement;
