# group-winner-widget

A widget that shows all groups inside a competition and shows a betoffer for the team to be placed first in the group.

The groups are shown as tabs, if there are more groups that can be shown, in desktop mode arrows will appear to scroll between the available groups, in mobile mode now arrows will be shown and the tab area will be scrollable.

The title and tagline (subtitle) of the widget are taken from the event and the betoffer criterion label by default. The widget will check for the next match in the competition and select the group that that match belongs in. The widget will also remove itself from the sportsbook if its filter competition is not present in the highlights list (the popular list).


## Configuration

Arguments and default values:
```json
"args": {
    "filter": "football/world_cup_qualifying_-_europe/all",
    "title": null,
    "tagline": null,
    "criterionId": 1001615382,
    "customCssUrl": "https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/{customer}/style.css",
    "customCssUrlFallback": "https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/kambi/style.css",
    "flagUrl": "https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/",
    "pollInterval": 30000,
    "widgetTrackingName:" "gm-group-winner-widget",
}
```

1. `filter` - string - filter string that points to the events that the widget should show
2. `title` - string - main widget title, if undefined uses `event.group` value
3. `tagline` - string - the subtitle of the widget, if undefined uses `betoffer.criterion.label`
4. `criterionId` - number - the criterionId of the betoffer that is supposed to be shown in the widget
5. `customCssUrl` - string - path to load operator-specific CSS from. The default value customizes the logo shown
6. `customCssUrlFallback` - string - path to load CSS from in case customCssUrl does not exist
7. `flagUrl` - string - path to folder with flags of the teams. The final flag path that the widget uses is this value + the participantId + '.svg'
8. `pollInterval` - number - how often (in milliseconds) should the widget check for new live data if the event is live
9. `widgetTrackingName` - string - tracking name for analytics purposes

### Build Instructions

Please refer to the [core-library](https://github.com/kambi-sportsbook-widgets/widget-core-library)
