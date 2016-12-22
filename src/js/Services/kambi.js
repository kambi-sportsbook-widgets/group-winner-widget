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
            // if finishes with /all remove it
            // the pathTermId in the highlight can ommit the /all at the end
            if (pathTermId2.slice(-4) === '/all') {
               pathTermId2 = pathTermId2.slice(0, -4);
            }
            response.groups.forEach(( item ) => {
               // Check if the configured filter exists in the highligh resource, if not reject the promise
               if ( item.pathTermId === pathTermId1 || item.pathTermId === pathTermId2 ) {
                  resolve();
               }
            });
            reject('Filter: ' + filter + ' does not exist in the highlight resource');
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
}

export default KambiService;
