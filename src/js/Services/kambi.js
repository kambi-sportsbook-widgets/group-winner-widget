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
      return new Promise(( resolve, reject ) => {
         offeringModule.getHighlight()
         .then(( response ) => {
            var pathTermId1 = '/' + filter;
            var pathTermId2 = '/' + filter;
            resolve();
         })
         .catch(( err ) => {
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

   static getAll(filter) {
      return Promise.all([this.betofferPromise(filter), this.matchesPromise(filter), this.highlightPromise(filter)])
      .then((promiseData) => {
         return this.filterOutBetOffers(promiseData[0].events);
      })
      .catch((err) => {
         console.debug('Error in request');
         console.debug(err);
         widgetModule.removeWidget();
      });
   }

   static filterOutBetOffers ( events ) {

      var mappings = {};
      mappings[this.scope.args.criterionId] = 'groups';

      var ret = {
         groups: []
      };

      var i = 0, len = events.length;
      for ( ; i < len; ++i ) {
         if ( events[i].betOffers != null && events[i].betOffers.length === 1 ) {
            if ( mappings.hasOwnProperty(events[i].betOffers[0].criterion.id) ) {

               /* if (this.scope.tagline == null) {
                  if (this.scope.args.tagline != null) {
                     this.scope.tagline = this.scope.args.tagline;
                  } else {
                     if (events[i].betOffers.length > 0) {
                        this.scope.tagline = events[i].betOffers[0].criterion.label;
                     }
                  }
               } */

               /* if (this.scope.title == null) {
                  if (this.scope.args.title != null) {
                     this.scope.title = this.scope.args.title;
                  } else {
                     this.scope.title = events[i].event.group;
                  }
               }*/

               events[i].betOffers[0].outcomes.sort(function ( a, b ) {
                  if ( a.odds < b.odds ) {
                     return -1;
                  }
                  if ( a.odds > b.odds ) {
                     return 1;
                  }
                  return 0;
               });
               ret[mappings[events[i].betOffers[0].criterion.id]].push(events[i]);
            }
         }
      }

      ret.groups.sort(function ( a, b ) {
         if ( a.event.name < b.event.name ) {
            return -1;
         }
         if ( a.event.name > b.event.name ) {
            return 1;
         }
         return 0;
      });

      return ret;
   }
}

export default KambiService;
