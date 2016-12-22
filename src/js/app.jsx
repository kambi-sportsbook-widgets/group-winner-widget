import { widgetModule, coreLibrary, eventsModule } from 'kambi-widget-core-library';
import '../scss/app.scss';
import KambiService from './Services/kambi';
import Widget from './Widget';

/**
 * Removes widget on fatal errors.
 * @param {Error} error Error instance
 */
const onFatal = function (error) {
   widgetModule.removeWidget();
   throw error;
};

coreLibrary.init({
   filter: [
      'football/world_cup_qualifying_-_europe/all',
   ],
   title: null,
   tagline: null,
   criterionId: 1001615382,
   combineFilters: false,
   customCssUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/match-overview-widget/{customer}/style.css',
   customCssUrlFallback: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/match-overview-widget/kambi/style.css',
   flagUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/',
   pollingInterval: 30000,
   pollingCount: 4,
   eventsRefreshInterval: 120000,
   widgetTrackingName: 'gm-group-winner-widget',
})
.then(() => {
   coreLibrary.setWidgetTrackingName(coreLibrary.args.widgetTrackingName);
   eventsModule.liveEventPollingInterval = coreLibrary.args.pollingInterval;
   return KambiService.getAll(coreLibrary.args.filter);
})
.then((data) => {

   const widget = new Widget(
      {
         combineFilters: coreLibrary.args.combineFilters,
         eventsRefreshInterval: coreLibrary.args.eventsRefreshInterval,
         pollingCount: coreLibrary.args.pollingCount,
         onFatal
      }
   );
})
.catch(onFatal);
