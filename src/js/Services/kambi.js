import { offeringModule } from 'kambi-widget-core-library'
import Filter from './filter';

class KambiService {

   /**
    * Returns first filter which exists in highlights.
    * @param {string[]} filters Filters to match against
    * @returns {Promise.<boolean>}
    */
   static getHighlightedFilter(filters) {
      return offeringModule.getHighlight()
         .then((response) => {
            // uncomment line below in order to test the widget
            // response.groups[0].pathTermId = '/football/world_cup_qualifying_-_europe';

            const sanitizedFilters = filters.map(Filter.sanitize);

            return response.groups.reduce((filter, group) => {
               if (filter) {
                  return filter;
               }

               const idx = sanitizedFilters.indexOf(Filter.sanitize(group.pathTermId));

               if (idx > -1) {
                  return filters[idx];
               }

               return null;
            }, null);
         });
   }

   /**
    * Fetches groups for given tournament.
    * @param {string} filter Tournament's filter
    * @param {number?} criterionId Tournament criterion identifier
    * @param {function(object):string?} groupNameFunc Group name generator
    * @returns {Promise.<object[]>}
    */
   static getGroups(filter, criterionId, groupNameFunc) {
      return offeringModule.getEventsByFilter(Filter.competitions(filter))
         .then(competitions => Promise.all(competitions.events.map(event => offeringModule.getEvent(event.event.id))))
         .then((events) => {
            return events

               .filter(event => event.betOffers)

               .map((event) => {
                  if (criterionId === null) {
                     // pick first bet offer
                     event.betOffers.splice(1);
                  } else {
                     event.betOffers = event.betOffers.filter(betOffer => betOffer.criterion.id == criterionId);
                  }

                  return event;
               })

               // must have any bet offers
               .filter(event => event.betOffers.find(bo => bo))

               // set groupName
               .map(event => Object.assign(event, { groupName: groupNameFunc ? groupNameFunc(event) : event.event.englishName }))

               // sort based on groupName field
               .sort((a, b) => a.groupName.localeCompare(b.groupName))

               // remove the prelive event if there is one live of same groupName
               .filter((group, i, groups) => {
                  if (group.betOffers[0].live) {
                     return true;
                  }

                  return !groups.find(g => g.groupName == group.groupName && g.betOffers[0].live);
               })

               // sort outcomes by odds value
               .map((group) => {
                  group.betOffers.forEach(betOffer => betOffer.outcomes.sort((a, b) => a.odds - b.odds));
                  return group;
               });
         });
   }

   /**
    * Returns home team name of tournament's closest match.
    * @param {string} filter Tournament's filter
    * @returns {Promise.<string|null>}
    */
   static getNextMatchHomeName(filter) {
      return offeringModule.getEventsByFilter(Filter.matches(filter))
         .then((matches) => {
            const currentTime = Date.now();

            return matches.events
               .filter(m => m.event.type === 'ET_MATCH' && m.event.start != null && m.event.start > currentTime)
               .sort((a, b) => a.event.start - b.event.start);
         })
         .then(matches => (matches.length > 0 ? matches[0].event.homeName : null));
   }

}

export default KambiService;
