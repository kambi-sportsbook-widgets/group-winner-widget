import { offeringModule, widgetModule } from 'kambi-widget-core-library'

class KambiService {

   static checkEventCount(events) {
      if (events.length === 0) {
         console.debug('No tournament groups found, widget removing itself');
         widgetModule.removeWidget();
      }
   }

   static betofferPromise(filter) {
      return new Promise((resolve, reject) => {
         offeringModule
         .getEventsByFilter(filter + '/all/competitions/')
         .then((response) => {
            resolve(response);
         })
         .catch((err) => {
            console.debug(err, this.state);
            reject(err);
         });
      });
   }

   static highlightPromise(filter) {
      return new Promise((resolve, reject) => {
         offeringModule.getHighlight()
         .then((response) => {
            var pathTermId1 = '/' + filter;
            var pathTermId2 = '/' + filter;
            resolve();
         })
         .catch((err) => {
            console.debug(err);
            reject(err);
         });
      });
   }

   static matchesPromise(filter) {
      return new Promise((resolve, reject) => {
         offeringModule
         .getEventsByFilter(filter + '/all/matches/')
         .then((response) => {
            resolve(response);
         })
         .catch((err) => {
            console.debug(err);
            reject(err);
         });
      });
   }

   static getAll(filter, criterionId) {
      return Promise.all([this.betofferPromise(filter), this.matchesPromise(filter), this.highlightPromise(filter)])
      .then((promiseData) => {
         return this.filterOutBetOffers(promiseData[0].events, criterionId);
      })
      .catch((err) => {
         console.debug('Error in request');
         console.debug(err);
         widgetModule.removeWidget();
      });
   }

   static getGroupName(name) {
      return name.split(' ')[name.split(' ').length - 1];
   }

   static getGroupNames(events) {
      return events.groups.map(group => group.event.englishName)
      .map(name => ({ groupName: name.split(' ')[name.split(' ').length - 1] }));
   }

   static filterOutBetOffers(events, criterionId) {
      const mappings = {};
      mappings[criterionId] = 'groups';

      const result = {
         groups: []
      };

      for (var i = 0; i < events.length; ++i) {
         if (events[i].betOffers != null && events[i].betOffers.length === 1) {
            if (mappings.hasOwnProperty(events[i].betOffers[0].criterion.id)) {
               result[mappings[events[i].betOffers[0].criterion.id]].push(events[i]);
            }
         }
      }
      return result;
   }
}

export default KambiService;
