import React, { PropTypes } from 'react';
import styles from './BlendedImage.scss';

const BlendedImage = ({ imgPath }) => (
   <svg className={styles.general} xmlnsXlink='http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg'>
      <defs>
         <mask id='svgmask2'>
            <image width='100%' height='100%' xlinkHref={imgPath} />
         </mask>
      </defs>
      <rect mask='url(#svgmask2)' id='blendRect' x='0' y='0' width='100%' height='100%' />
   </svg>
);

BlendedImage.propTypes = {

   /**
    * Image path
    */
   imgPath: PropTypes.string.isRequired,

};

export default BlendedImage;