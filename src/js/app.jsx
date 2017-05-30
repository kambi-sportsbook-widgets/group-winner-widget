import { widgetModule, coreLibrary, eventsModule } from 'kambi-widget-core-library';
import '../scss/app.scss';
import KambiService from './Services/kambi';
import Widget from './Widget';

coreLibrary.init({
   filter: 'football/world_cup_qualifying_-_europe/all',
   title: null,
   tagline: null,
   criterionId: 1001615382,
   skipHighlightsCheck: false,
   pollingInterval: 30000,
   widgetTrackingName: 'gm-group-winner-widget',
})
.then(() => {
   coreLibrary.widgetTrackingName = coreLibrary.args.widgetTrackingName;
   eventsModule.liveEventPollingInterval = coreLibrary.args.pollingInterval;

   return coreLibrary.args.skipHighlightsCheck
      ? true
      : KambiService.existsInHighlights(coreLibrary.args.filter);
})
.then((existsInHighlights) => {
   if (!existsInHighlights) {
      console.error(`Filter: ${coreLibrary.args.filter} does not exist in the highlight resource`);
      widgetModule.removeWidget();
      return;
   }

   const widget = new Widget({
      title: coreLibrary.args.title,
      tagline: coreLibrary.args.tagline,
      removeWidget: widgetModule.removeWidget.bind(widgetModule)
   });

   return widget.init(
      coreLibrary.args.filter,
      coreLibrary.args.criterionId
   );
})
.catch((error) => {
   widgetModule.removeWidget();
   throw error;
});
