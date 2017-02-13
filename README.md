# group-winner-widget

![](./screenshot.png)

Overview of competition's group phase. Contains participants list for each group on separate tabs and allows to bet on the group winner. Widget won't show if there is no supported filter found in current highlights. 

## Configuration example:

Arguments and default values:

```json
...
{
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
         criterionId: 1001221607,
         flags: false
      },
      {
         filter: '/ice_hockey/nhl',
         criterionId: 1001581538,
         flags: false
      },
      {
         filter: '/ice_hockey/sweden/shl',
         criterionId: 1001581538,
         flags: false
      }
   ],
   title: null,
   tagline: null,
   customCssUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/match-overview-widget/{customer}/style.css',
   customCssUrlFallback: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/match-overview-widget/kambi/style.css',
   flagUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/',
   pollingInterval: 30000,
   widgetTrackingName: 'gm-group-winner-widget'
},
...

```

### The widget accepts the following arguments:

1.  `filter` - string - competition filter. If set it will override default behaviour and force given filter to be used.
2. `supported` - object - array of supported leagues and their configuration
   1. `supported.filter` - string - league filter to search in highlights
   2. `supported.criterionId` - string - only bet offers matching that criterion identifier will be displayed
   3. `supported.flags` - string - if true the flags will be displayed on the left of participant name. In order to correctly display flags they have to be referenced in `customCssUrl` stylesheet.
3. `title` - string - widget's title which will be figured out if not provided
4. `tagline` - string - widget's tag line which will be figured out if not provided
5. `customCssUrl` - string - path to load operator-specific CSS from
6. `customCssUrlFallback` - string - path to load CSS from in case customCssUrl does not exist
7. `flagUrl` - string - base URL of directory which should contain necessary flags
8. `pollingInterval` - number - interval in milliseconds to get new live data for live matches
9. `widgetTrackingName` - string - tracking name for analytics purposes


### Build Instructions

Please refer to the [core-library](https://github.com/kambi-sportsbook-widgets/widget-core-library)
