/**
 * Competition event type
 * @type {string}
 */
const COMPETITIONS = 'competitions';

/**
 * Match event type
 * @type {string}
 */
const MATCHES = 'matches';

/**
 * Event filter target length
 * @type {number}
 */
const FILTER_LENGTH = 5;

/**
 * Kambi API filter utility class
 */
class Filter {

   /**
    * Strips all unnecessary parts from filter string.
    * @param {string} filter Filter to be sanitized
    * @returns {string}
    */
   static sanitize(filter) {
      // strip following /all's
      filter = filter.replace(/(\/all)*\/?$/, '');

      // ensure it starts with a '/' and doesn't end with '/'
      const matches = filter.match(/^\/?(.*)\/?$/);

      if (!matches) {
         throw new Error(`Invalid filter: ${filter}`);
      }

      return matches[1];
   }

   /**
    * Creates event type filter for given common filter.
    * @param {string} filter Filter
    * @param {string} type Events type (COMPETITIONS or MATCHES)
    * @returns {string}
    */
   static events(filter, type) {
      const parts = this.sanitize(filter)
         .split('/')
         .filter(termKey => !!termKey);

      // fill filter's 'missing' parts with 'all'
      for (let i = parts.length; i < FILTER_LENGTH - 1; i++) {
         parts.push('all');
      }

      parts.push(type);

      return parts.join('/');
   }

   /**
    * Returns competitions filter for given common filter.
    * @param {string} filter Common filter
    * @returns {string}
    */
   static competitions(filter) {
      return this.events(filter, COMPETITIONS);
   }

   /**
    * Returns matches filter for given common filter.
    * @param {string} filter Common filter
    * @returns {string}
    */
   static matches(filter) {
      return this.events(filter, MATCHES);
   }

}

export default Filter;
