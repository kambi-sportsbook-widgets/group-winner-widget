import { widgetModule, coreLibrary, eventsModule } from 'kambi-widget-core-library';
import '../scss/app.scss';
import kambi from './Services/kambi';
import mobile from './Services/mobile';
import live from './Services/live';
import Widget from './Widget';

/**
 * Removes widget on fatal errors.
 * @param {Error} error Error instance
 */
const onFatal = function(error) {
   widgetModule.removeWidget();
   throw error;
};

coreLibrary.init({
   filter: [
      'football/world_cup_qualifying_-_europe/all/all/competitions',
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
   return kambi.getEvents(coreLibrary.args.filter);
})
.then((filters) => {

    if (filters.length === 0) {
      onFatal(new Error('No matching filters in highlight'));
      return;
   }

   const widget = new Widget(
      filters,
      {
         combineFilters: coreLibrary.args.combineFilters,
         eventsRefreshInterval: coreLibrary.args.eventsRefreshInterval,
         pollingCount: coreLibrary.args.pollingCount,
         onFatal
      }
   );
})
.catch(onFatal);
