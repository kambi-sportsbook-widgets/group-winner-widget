import { coreLibrary, offeringModule, widgetModule } from 'kambi-widget-core-library';

/**
 * Checks the highlight resource against the supported filters and decides whether the widget is online or not
 * @param {string[]} supportedFilters Supported filters
 * @returns Promise.<string[]>
 */
const getHighlightedFilters = function(supportedFilters) {
   return offeringModule.getHighlight()
   .then((response) => {
      if (!Array.isArray(response.groups)) {
         throw new Error('Highlight response empty, hiding widget');
      }

      return response.groups
      .map(group => group.pathTermId)
      .filter(filter => supportedFilters.indexOf(filter) !== -1);
   });
};

/**
 * Filters events that are matches from getEventsByFilter response.
 * @param {object} response getEventsByFilter response
 * @returns {object[]}
 */
const filterEvents = function(response) {
   if (!response || !Array.isArray(response.events)) {
      return [];
   }

   return response.events
   .filter(event => event.event.type === 'ET_MATCH');
};

/**
 * Fetches events by combining given filters together.
 * @param {String[]} filters
 * @returns {Promise.<object[]>}
 */
const getEventsCombined = function(filters) {
   const filter = widgetModule.createFilterUrl(filters);
   let replaceString = '#filter/';

   if (coreLibrary.config.routeRoot !== '') {
      replaceString = '#' + coreLibrary.config.routeRoot + '/filter/';
   }

   const url = filter ? filter.replace(replaceString, '') : 'football';

   return offeringModule.getEventsByFilter(url)
   .then(filterEvents)
   .then((events) => {
      return { events, filter };
   });
};

/**
 * Fetches events by checking filters one after another until finding matching events.
 * @param {String[]} filters Filters to check
 * @returns {Promise.<{filter: string, events: object[]}>}
 */
const getEventsProgressively = function(filters) {
   // start searching for events
   const loop = (i) => {
      if (i >= filters.length) {
         // no more filters to check
         return null;
      }
      // checking ith filter
      return offeringModule.getEventsByFilter(filters[i].replace(/^\//, ''))
      // uncomment this to test falling back to the second filter
      // .then((res) => {
      //    if (i < 1) {
      //       res.events = [];
      //    }
      //    return res;
      // })
      .then(filterEvents)
      .then((events) => {
         if (events.length > 0) {
            // found matching events
            return { filter: filters[i], events };
         }

         // matching events not found, proceed to next filter
         return Promise.resolve(i + 1)
         .then(loop);
      });
   };

   return Promise.resolve(0)
   .then(loop);
};

/**
 * Fetches events for given filter list.
 * Returns object having events array and applied filter field.
 * @param {string[]} filters Filters
 * @param {boolean} combined Whether events should be fetched using single combined query or one filter at the time
 * @returns {Promise.<{events: object[], filter: string}>}
 */
const getEvents = function(filters, combined = true) {
   const getEventsFunc = combined ? getEventsCombined : getEventsProgressively;
   return getEventsFunc(filters);
};

export default { getHighlightedFilters, getEvents };
