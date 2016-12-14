import { OutcomeButtonUI } from 'kambi-widget-components';
import React from 'react';
import styles from './CountryListElement.scss';

const CountryListElement = ({ country, value, flagUrl }) => {
   return (
      <tr className={styles.general}>
         <td className={styles.flag}><img role='presentation'
                                          width='25px'
                                          height='25px'
                                          src={'https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/1000000062.svg'}/>
         </td>
         <td className={styles.country}>{ country }</td>
         <td className={styles.button}><OutcomeButtonUI odds={value}/></td>
      </tr>)
};

CountryListElement.propTypes = {
   country: React.PropTypes.node,
   flagUrl: React.PropTypes.string,
   value: React.PropTypes.string
};

export default CountryListElement;
