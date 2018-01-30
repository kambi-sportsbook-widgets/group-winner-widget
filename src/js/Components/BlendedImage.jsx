import React from 'react'
import PropTypes from 'prop-types'
import styles from './BlendedImage.scss'

const BlendedImage = ({ imgPath }) => (
  <svg
    className={styles.general}
    xmlnsXlink="http://www.w3.org/1999/xlink&quot; xmlns=&quot;http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="svgmask2">
        <image width="100%" height="100%" xlinkHref={imgPath} />
      </mask>
    </defs>
    <rect
      mask="url(#svgmask2)"
      className={`KambiWidget-primary-color ${styles.blendRect}`}
      x="0"
      y="0"
      width="100%"
      height="100%"
    />
  </svg>
)

BlendedImage.propTypes = {
  /**
   * Image path
   */
  imgPath: PropTypes.string.isRequired,
}

export default BlendedImage
