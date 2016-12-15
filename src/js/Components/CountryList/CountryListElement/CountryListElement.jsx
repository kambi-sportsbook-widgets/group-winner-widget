import { OutcomeButtonUI } from 'kambi-widget-components';
import React from 'react';
import styles from './CountryListElement.scss';

const CountryListElement = ({ country, value, flagUrl }) => {
   return (
      <tr className={styles.general}>
         <td className={styles.flag}>
            <img
               role='presentation'
               className='l-mr-12'
               width='24'
               height='24'
               src={flagUrl} />
         </td>
         <td className={styles.country}>{ country }</td>
         <td className={styles.button}><OutcomeButtonUI odds={value} /></td>
      </tr>)
};

CountryListElement.propTypes = {
   country: React.PropTypes.node,
   flagUrl: React.PropTypes.string,
   value: React.PropTypes.string
};

export default CountryListElement;
