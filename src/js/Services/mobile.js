/**
 * Indicates mobile browser
 * @type {boolean}
 */
const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * Maximum mobile screen size
 * @type {number}
 */
const MOBILE_SCREEN_MAX_SIZE = 768;

/**
 * Determines if the page is being displayed on mobile device.
 * @returns {boolean}
 */
const isMobile = function() {
   return document.body.offsetWidth <= MOBILE_SCREEN_MAX_SIZE
      && ('ontouchstart' in window)
      && isMobileBrowser;
};

export default isMobile;
