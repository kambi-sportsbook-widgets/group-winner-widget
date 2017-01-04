import { widgetModule, coreLibrary, eventsModule } from 'kambi-widget-core-library';
import '../scss/app.scss';
import KambiService from './Services/kambi';
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
   filter: 'football/world_cup_qualifying_-_europe/all',
   title: null,
   tagline: null,
   criterionId: 1001615382,
   customCssUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/match-overview-widget/{customer}/style.css',
   customCssUrlFallback: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/match-overview-widget/kambi/style.css',
   flagUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/',
   pollingInterval: 30000,
   widgetTrackingName: 'gm-group-winner-widget',
})
.then(() => {
   coreLibrary.setWidgetTrackingName(coreLibrary.args.widgetTrackingName);
   eventsModule.liveEventPollingInterval = coreLibrary.args.pollingInterval;

   return KambiService.existsInHighlights(coreLibrary.args.filter);
})
.then((existsInHighlights) => {
   if (!existsInHighlights) {
      console.error(`Filter: ${coreLibrary.args.filter} does not exist in the highlight resource`);
      widgetModule.removeWidget();
      return;
   }

   const widget = new Widget({
      filter: coreLibrary.args.filter,
      criterionId: coreLibrary.args.criterionId,
      title: coreLibrary.args.title,
      tagline: coreLibrary.args.tagline,
      flagUrl: coreLibrary.args.flagUrl,
      removeWidget: widgetModule.removeWidget.bind(widgetModule)
   });
})
.catch(onFatal);
