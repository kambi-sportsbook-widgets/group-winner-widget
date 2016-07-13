(function () {
   'use strict';

   var GroupWinner = CoreLibrary.Component.subclass({

      defaultArgs: {
         filter: 'football/world_cup_qualifying_-_europe',
         title: 'Group winner',
         tagline: null,
         criterionId: 1001615382,
         tournamentName: 'wcq',
         widgetTrackingName: 'gm-group-winner',
         pollInterval: 30000
      },

      constructor () {
         CoreLibrary.Component.apply(this, arguments);
         this.events = [];
      },

      init () {
         CoreLibrary.setWidgetTrackingName(this.scope.args.widgetTrackingName);
         this.scope.mpe = 12;
         this.handleCustomCss();

         this.scope.title = null;
         this.scope.tagline = null;

         this.scope.baseHeight = 132;
         this.scope.rowHeight = 44;
         this.scope.maxOutcomeCount = 0;

         // Get the betoffers
         var betofferPromise = new Promise(( resolve, reject ) => {
            CoreLibrary.offeringModule
               .getEventsByFilter(this.scope.args.filter + '/all/all/competitions/')
               .then(( response ) => {
                  resolve(response);
               })
               .catch(( err ) => {
                  console.debug(err, this.scope);
                  reject(err);
               });
         });

         var matchesPromise = new Promise(( resolve, reject ) => {
            CoreLibrary.offeringModule
               .getEventsByFilter(this.scope.args.filter + '/all/all/matches/')
               .then(( response ) => {
                  resolve(response);
               })
               .catch(( err ) => {
                  console.debug(err);
                  reject(err);
               });
         });

         // When both data fetching promises are resolved, we can create the modules and send them the data
         Promise.all([betofferPromise, matchesPromise])
            .then(( promiseData ) => {
               var filteredEvents = this.filterOutBetOffers(promiseData[0].events);

               if ( filteredEvents.groups != null ) {
                  var i = 0, arrLength = filteredEvents.groups.length;
                  for ( ; i < arrLength; ++i ) {
                     var item = filteredEvents.groups[i];
                     if ( item.betOffers[0].outcomes.length > this.scope.maxOutcomeCount ) {
                        this.scope.maxOutcomeCount = item.betOffers[0].outcomes.length;
                     }
                  }

                  // extracting group names
                  filteredEvents.groups.forEach(( ev ) => {
                     ev.groupName = ev.event.englishName.split(' ');
                     ev.groupName = ev.groupName[ev.groupName.length - 1];
                  });

                  /*
                   Sorting based on group name. The sorting provided by the API
                   is based on event.name but we need to sort based on event.englishName
                   (russian uses a different alphabet which screws up the ordering)
                   */
                  filteredEvents.groups.sort(( a, b ) => {
                     if ( a.groupName > b.groupName ) {
                        return 1;
                     }
                     return -1;
                  });

                  // after sorting, assumes duplicates would be one next to other,
                  // we remove the prelive event if there is one live of same groupName
                  filteredEvents.groups.forEach(( ev, index, arr ) => {
                     if ( index > 0 && ev.groupName === arr[index - 1]['groupName'] ) {
                        if ( ev.betOffers[0].live ) {
                           filteredEvents.groups.splice(index - 1, 1);
                        } else {
                           filteredEvents.groups.splice(index, 1);
                        }

                     }
                  });

                  this.scope.events = filteredEvents.groups;

                  // Extra precaution to clear intervals
                  if ( this.scope.liveIntervals != null ) {
                     for ( var i in this.scope.liveIntervals ) {
                        if ( this.scope.liveIntervals.hasOwnProperty(i) ) {
                           clearInterval(this.scope.liveIntervals[i]);
                        }
                     }
                  } else {
                     this.scope.liveIntervals = {};
                  }

                  // Check each event and it's betOffer, if it's live we set up polling for it
                  this.scope.events.forEach(( ev, index, arr ) => {
                     if ( ev.betOffers[0].live ) {
                        console.debug('Live event', ev.event.id);
                        this.pollLiveData(ev);
                     }
                  });

                  this.checkEventCount();
               }

               // Finding out the next match and focusing on that match groups tab
               var matches = promiseData[1].events;
               var currentTime = Date.now();
               matches = matches
                  .filter(( m ) => {
                     if ( m.event.type === 'ET_MATCH' && m.event.start != null && m.event.start > currentTime ) {
                        return true;
                     }
                     return false;
                  }).sort(( a, b ) => {
                     if ( a.event.start > b.event.start ) {
                        return 1;
                     }
                     return -1;
                  });
               var nextMatchHomeName = matches[0].event.homeName;
               var tabToFocus = 0;
               this.scope.events.forEach(( e, index ) => {
                  e.betOffers[0].outcomes.forEach(( o ) => {
                     // we can't compare ids here, but this comparison works
                     // even across different locales
                     if ( o.label === nextMatchHomeName ) {
                        tabToFocus = index;
                     }
                  });
               });

               this.pagination = new CoreLibrary.CustomPaginationComponent('#pagination', this.scope, 'events', 1, filteredEvents.groups.length);

               this.pagination.setCurrentPage(tabToFocus);
               CoreLibrary.widgetModule.setWidgetHeight(this.scope.baseHeight + ( this.scope.rowHeight * this.scope.maxOutcomeCount));
            })
            .catch(( err ) => {
               console.debug('Error in request');
               console.debug(err);
               CoreLibrary.widgetModule.removeWidget();
            });

      },

      /**
       * Sets up polling for an event
       *
       * @param {Object} ev event object
       */

      pollLiveData ( ev ) {
         this.scope.liveIntervals[ev.event.id] = setInterval(() => {
            CoreLibrary.offeringModule.getLiveEvent(ev.event.id)
               .then(( res ) => {
                  // Sort outcomes according to odds
                  res.betOffers[0].outcomes.sort(function ( a, b ) {
                     if ( a.odds < b.odds ) {
                        return -1;
                     }
                     if ( a.odds > b.odds ) {
                        return 1;
                     }
                     return 0;
                  });

                  // Disabled animations
                  ev.animationDisable = true;
                  // Set the betOffer property to null to trigger the update in rivets
                  ev.betOffers = null;
                  ev.betOffers = res.betOffers;
                  // Turn on animations
                  ev.animationDisable = false;
               })
               .catch(( error ) => {
                  // Check if the event is gone
                  if ( error.response.status === 404 ) {
                     console.debug('Live event does not exist anymore');
                     // Clear the polling interval for the event
                     clearInterval(this.scope.liveIntervals[ev.event.id]);
                     // Remove the event
                     this.removeEvent(ev.event.id);
                  }
               });
         }, this.scope.args.pollInterval);
      },

      /**
       * Removes an event from the scope.events
       * @param eventId The id of the event to remove
       */
      removeEvent ( eventId ) {
         var foundIndex = -1;
         // Iterate over the events and look for the id
         this.scope.events.forEach(( ev, index, arr ) => {
            if ( ev.event.id === eventId ) {
               foundIndex = index;
            }
         });
         // If we find the id, we remove it
         if ( foundIndex !== -1 ) {
            this.scope.events.splice(foundIndex, 1);
         }
         // Check if there are any betoffers to show
         this.checkEventCount();
      },

      /**
       * Checks that there are any groups to show, otherwise, removes the widget
       */
      checkEventCount () {
         if ( this.scope.events.length === 0 ) {
            console.debug('No tournament groups found, widget removing itself');
            CoreLibrary.widgetModule.removeWidget();
         }
      },

      /**
       * Goes through an array of events filters out the events with betoffers that can be mapped based on their criterion id
       * @param {Array} events An array of event objects containing events and betOffers
       * @returns {{groups: Array, topScorer: Array, tournamentWinner: Array}}
       */
      filterOutBetOffers ( events ) {
         // Map the criterion
         var mappings = {};
         mappings[this.scope.args.criterionId] = 'groups';

         // The return object
         var ret = {
            groups: []
         };

         // Iterate over the events array
         var i = 0, len = events.length;
         for ( ; i < len; ++i ) {
            // Check if the event has one and only one betOffer
            if ( events[i].betOffers != null && events[i].betOffers.length === 1 ) {
               // Check if the criterion id is one we've mapped
               if ( mappings.hasOwnProperty(events[i].betOffers[0].criterion.id) ) {
                  // Set the tagline from the outcome criterion so we get it translated
                  this.scope.tagline = ( this.scope.tagline == null || this.scope.tagline === this.scope.args.tagline ) ?
                     events[i].betOffers[0].criterion.label : this.scope.args.tagline;
                  // Set title as well
                  this.scope.title = ( this.scope.title == null || this.scope.title === this.scope.args.title ) ?
                     events[i].event.group : this.scope.args.title;
                  // Sort outcomes based on odds
                  events[i].betOffers[0].outcomes.sort(function ( a, b ) {
                     if ( a.odds < b.odds ) {
                        return -1;
                     }
                     if ( a.odds > b.odds ) {
                        return 1;
                     }
                     return 0;
                  });
                  // If it is, add it to the return object
                  ret[mappings[events[i].betOffers[0].criterion.id]].push(events[i]);
               }
            }
         }
         // Sort alphabetically the groups
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
      },

      handleCustomCss () {
         this.dataUrl = ( this.scope.args.dataUrl ? this.scope.args.dataUrl + '{tournament}/css/{customer}/' : '' +
            '//kambi-cdn.globalmouth.com/tournamentdata/{tournament}/css/{customer}/' ) + 'style.css';
         this.scope.customCssUrl = this.dataUrl.replace(/\{customer}/, CoreLibrary.config.customer).replace(/\{tournament}/, this.scope.args.tournamentName);

         fetch(this.scope.customCssUrl)
            .then(( response ) => {
               if ( response.status >= 200 && response.status < 300 ) {
                  this.scope.customCss = this.scope.customCssUrl;
               } else {
                  this.scope.customCss = 'custom/style.local.css';
               }
            })
            .catch(( error ) => {
               this.scope.customCss = 'custom/style.local.css';
               console.debug('Error fetching css');
            });
      }

   });

   var groupWinner = new GroupWinner({
      rootElement: 'html'
   });

})();
