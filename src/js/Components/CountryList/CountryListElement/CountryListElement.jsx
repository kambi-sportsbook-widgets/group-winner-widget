import { OutcomeButton } from 'kambi-widget-components';
import React, { PropTypes } from 'react';
import styles from './CountryListElement.scss';

const CountryListElement = ({ country, outcomes, flagUrl, onClick }) => {
   return (
      <tr className={styles.row}>
         <td className={styles.flag} onClick={onClick}>
            {flagUrl &&
               <img role='presentation' src={flagUrl} />}
         </td>
         <td className={styles.country} onClick={onClick}>
            {country}
         </td>
         {outcomes.map((outcome, i) =>
            <td key={i} className={styles.button}>
               <div className={styles.wrapper}>
                  {outcome &&
                     <OutcomeButton outcome={outcome} label={false} />}
               </div>
            </td>
         )}
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
   flagUrl: PropTypes.string,

   /**
    * Outcome for this country
    */
   outcomes: PropTypes.arrayOf(PropTypes.object).isRequired,

   /**
    * Row click callback
    */
   onClick: PropTypes.func.isRequired

};

export default CountryListElement;
