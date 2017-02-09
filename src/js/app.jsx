import { widgetModule, coreLibrary, eventsModule } from 'kambi-widget-core-library';
import '../scss/app.scss';
import KambiService from './Services/kambi';
import Widget from './Widget';

coreLibrary.init({
   filter: null,
   supported: [
      {
         filter: '/football/world_cup_qualifying_-_europe',
         criterionId: 1001615382,
         flags: true
      },
      {
         filter: '/football/england/premier_league',
         criterionId: 1001221607,
         flags: false
      },
      {
         filter: '/football/europa_league',
         criterionId: null,
         flags: false
      },
      {
         filter: '/ice_hockey/nhl',
         criterionId: null,
         flags: false
      },
      {
         filter: '/ice_hockey/sweden/shl',
         criterionId: null,
         flags: false
      }
   ],
   title: null,
   tagline: null,
   customCssUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/match-overview-widget/{customer}/style.css',
   customCssUrlFallback: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/match-overview-widget/kambi/style.css',
   flagUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/',
   pollingInterval: 30000,
   widgetTrackingName: 'gm-group-winner-widget',
})
.then(() => {
   coreLibrary.setWidgetTrackingName(coreLibrary.args.widgetTrackingName);
   eventsModule.liveEventPollingInterval = coreLibrary.args.pollingInterval;

   // use explicitly given filter
   if (coreLibrary.args.filter) {
      return {
         filter: coreLibrary.args.filter,
         criterionId: null,
         flags: false
      };
   }

   // use one of the supported filters which is the first found in highlights resource
   return KambiService
      .getHighlightedFilter(coreLibrary.args.supported.map(({ filter }) => filter))
      .then(highlighted => (highlighted ? coreLibrary.args.supported.find(({ filter }) => filter == highlighted) : null));
})
.then((config) => {
   if (!config) {
      console.error('No matching filters in highlight resource');
      widgetModule.removeWidget();
      return;
   }

   const widget = new Widget({
      filter: config.filter,
      criterionId: config.criterionId,
      title: coreLibrary.args.title,
      tagline: coreLibrary.args.tagline,
      flagUrl: config.flags ? coreLibrary.args.flagUrl : null,
      removeWidget: widgetModule.removeWidget.bind(widgetModule)
   });
})
.catch((error) => {
   widgetModule.removeWidget();
   throw error;
});
