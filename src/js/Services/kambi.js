import { coreLibrary, offeringModule, widgetModule } from 'kambi-widget-core-library'

class KambiService {

   constructor(filter) {

      this.betofferPromise = new Promise((resolve, reject) => {
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

      this.matchesPromise = new Promise((resolve, reject) => {
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

      this.highlightPromise = new Promise((resolve, reject) => {
         offeringModule.getHighlight()
         .then((response) => {
            var pathTermId1 = '/' + this.filter;
            var pathTermId2 = '/' + this.filter;
            if (pathTermId2.slice(-4) === '/all') {
               pathTermId2 = pathTermId2.slice(0, -4);
            }
            response.groups.forEach((item) => {
               if (item.pathTermId === pathTermId1 || item.pathTermId === pathTermId2) {
                  resolve();
               }
            });
            reject('Filter: ' + this.filter + ' does not exist in the highlight resource');
         })
         .catch((err) => {
            console.debug(err);
            reject(err);
         });
      });

      this.getAll = function() {
         return Promise.all([this.betofferPromise, this.matchesPromise, this.highlightPromise])
         .then(( promiseData ) => {
            return this.filterOutBetOffers(promiseData[0].events);
         })
         .catch(( err ) => {
            console.debug('Error in request');
            console.debug(err);
            coreLibrary.widgetModule.removeWidget();
         });
      };

      this.checkEventCount = function (events) {
         if (events.length === 0) {
            console.debug('No tournament groups found, widget removing itself');
            widgetModule.removeWidget();
         }
      };
   }
}

export default KambiService;
