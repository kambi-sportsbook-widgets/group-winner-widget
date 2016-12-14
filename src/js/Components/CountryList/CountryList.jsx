import React from 'react';
import styles from './CountryList.scss';

const CountryList = ({ children }) => {
   return (<table className={styles.general}><tbody>{ children }</tbody></table>)
};

CountryList.propTypes = {
   children: React.PropTypes.node,
};

export default CountryList;
