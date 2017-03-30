import { OutcomeButton } from 'kambi-widget-components';
import React, { PropTypes } from 'react';
import styles from './CountryListElement.scss';

const CountryListElement = ({ country, outcome, flagUrl, onClick }) => {
   return (
      <tr className={styles.row}>
         <td className={styles.flag} onClick={onClick}>
            <img role='presentation' src={flagUrl} />
         </td>
         <td className={styles.country} onClick={onClick}>
            {country}
         </td>
         <td className={styles.button}>
            <OutcomeButton outcome={outcome} label={false} />
         </td>
      </tr>
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
