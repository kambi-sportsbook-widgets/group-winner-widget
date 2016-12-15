import { coreLibrary, widgetModule, offeringModule } from 'kambi-widget-core-library';

class Store {

   constructor() {
      this.defaultArgs = {
         filter: 'football/world_cup_qualifying_-_europe/all',
         // filter: 'football/england/premier_league',
         title: null,
         tagline: null,
         criterionId: 1001615382,
         customCssUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/{customer}/style.css',
         customCssUrlFallback: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/kambi/style.css',
         flagUrl: 'https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/',
         pollInterval: 30000,
         widgetTrackingName: 'gm-group-winner-widget'
      };

      this.args = Object.assign(this.defaultArgs, {});
      this.state = {};
   }

   init () {
      coreLibrary.setWidgetTrackingName(this.args.widgetTrackingName);
      this.state.mpe = 12;
      this.state.loaded = false;
      this.state.ismobile = this.isMobile();
      this.state.title = null;
      this.state.tagline = null;
      this.state.baseHeight = 132;
      this.state.rowHeight = 44;
      this.state.maxOutcomeCount = 0;
      this.state.navigateToEvent = this.navigateToEvent.bind(this);

      // Get the betoffers
      var betofferPromise = new Promise(( resolve, reject ) => {
         offeringModule
         .getEventsByFilter(this.args.filter + '/all/competitions/')
         .then(( response ) => {
            resolve(response);
         })
         .catch(( err ) => {
            console.debug(err, this.state);
            reject(err);
         });
      });

      var matchesPromise = new Promise(( resolve, reject ) => {
         offeringModule
         .getEventsByFilter(this.args.filter + '/all/matches/')
         .then(( response ) => {
            resolve(response);
         })
         .catch(( err ) => {
            console.debug(err);
            reject(err);
         });
      });

      // Get the contents of the 'Popular' list
      var highlightPromise = new Promise(( resolve, reject ) => {
         offeringModule.getHighlight()
         .then(( response ) => {
            var pathTermId1 = '/' + this.args.filter;
            var pathTermId2 = '/' + this.args.filter;
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
            reject('Filter: ' + this.args.filter + ' does not exist in the highlight resource');
         })
         .catch(( err ) => {
            console.debug(err);
            reject(err);
         });
      });

      // When both data fetching promises are resolved, we can create the modules and send them the data
      Promise.all([betofferPromise, matchesPromise, highlightPromise])
      .then(( promiseData ) => {
         var filteredEvents = this.filterOutBetOffers(promiseData[0].events);

         if ( filteredEvents.groups != null ) {
            var i = 0, arrLength = filteredEvents.groups.length;
            for ( ; i < arrLength; ++i ) {
               var item = filteredEvents.groups[i];
               if ( item.betOffers[0].outcomes.length > this.state.maxOutcomeCount ) {
                  this.state.maxOutcomeCount = item.betOffers[0].outcomes.length;
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

            this.state.events = filteredEvents.groups;

            // Extra precaution to clear intervals
            if ( this.state.liveIntervals != null ) {
               for ( var i in this.state.liveIntervals ) {
                  if ( this.state.liveIntervals.hasOwnProperty(i) ) {
                     clearInterval(this.state.liveIntervals[i]);
                  }
               }
            } else {
               this.state.liveIntervals = {};
            }

            // Check each event and it's betOffer, if it's live we set up polling for it
            this.state.events.forEach(( ev, index, arr ) => {
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
            if (a.event.start < b.event.start ) {
               return -1;
            }
            return 0;
         });
         var nextMatchHomeName = null;
         if (matches.length > 0) {
            nextMatchHomeName = matches[0].event.homeName;
         }
         var tabToFocus = 0;
         this.state.events.forEach(( e, index ) => {
            e.betOffers[0].outcomes.forEach(( o ) => {
               // we can't compare ids here, but this comparison works
               // even across different locales
               if ( nextMatchHomeName !== null && o.label === nextMatchHomeName ) {
                  tabToFocus = index;
               }
               o.flagPath = '' + this.args.flagUrl + o.participantId + '.svg';
            });
         });

         this.pagination = new coreLibrary.CustomPaginationComponent('#pagination', this.state, 'events', 1, filteredEvents.groups.length);

         // Delaying the transition until we get elements rendered
         setTimeout(() => {
            this.pagination.setCurrentPageOnCLick(tabToFocus);
         }, 200);

         widgetModule.setWidgetHeight(this.state.baseHeight + ( this.state.rowHeight * this.state.maxOutcomeCount));
         this.state.loaded = true;
      })
      .catch(( err ) => {
         console.debug('Error in request');
         console.debug(err);
         widgetModule.removeWidget();
      });
   }

   pollLiveData ( ev ) {
      this.state.liveIntervals[ev.event.id] = setInterval(() => {
         offeringModule.getLiveEvent(ev.event.id)
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
               clearInterval(this.state.liveIntervals[ev.event.id]);
               // Remove the event
               this.removeEvent(ev.event.id);
            }
         });
      }, this.state.args.pollInterval);
   }

   checkEventCount() {
      if (this.state.events.length === 0) {
         console.debug('No tournament groups found, widget removing itself');
         widgetModule.removeWidget();
      }
   }

   removeEvent ( eventId ) {
      var foundIndex = -1;
      // Iterate over the events and look for the id
      this.state.events.forEach(( ev, index, arr ) => {
         if ( ev.event.id === eventId ) {
            foundIndex = index;
         }
      });
      // If we find the id, we remove it
      if ( foundIndex !== -1 ) {
         this.state.events.splice(foundIndex, 1);
      }
      // Check if there are any betoffers to show
      this.checkEventCount();
   }

   filterOutBetOffers ( events ) {
      // Map the criterion
      var mappings = {};
      mappings[this.args.criterionId] = 'groups';

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
               if (this.state.tagline == null) {
                  if (this.args.tagline != null) {
                     this.state.tagline = this.args.tagline;
                  } else {
                     if (events[i].betOffers.length > 0) {
                        this.state.tagline = events[i].betOffers[0].criterion.label;
                     }
                  }
               }
               // Set title as well
               if (this.state.title == null) {
                  if (this.args.title != null) {
                     this.state.title = this.args.title;
                  } else {
                     this.state.title = events[i].event.group;
                  }
               }
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
   }

   navigateToEvent ( e, data ) {
      console.log(data, data.event.event.id);
      if ( data && data.event && data.event.event.openForLiveBetting != null && data.event.event.openForLiveBetting === true ) {
         widgetModule.navigateToLiveEvent(data.event.event.id);
      } else {
         widgetModule.navigateToEvent(data.event.event.id);
      }
   }

   handleIntervals ( interval ) {
      var onlineDate = {},
         intervalObj = this.state.args.hasOwnProperty(interval) ? this.args[interval] : null,
         date_now = new Date();

      if ( intervalObj && typeof intervalObj === 'object' && Object.keys(intervalObj).length ) {
         var i = 0, arrLength = Object.keys(intervalObj).length;
         for ( ; i < arrLength; ++i ) {
            var key = Object.keys(intervalObj)[i],
               value = intervalObj[key];

            var start = new Date(key),
               end = new Date(value);

            if ( date_now > start && date_now < end ) {
               onlineDate = {
                  online: start
               };
            }
         }
         this.scope.online = onlineDate.hasOwnProperty('online');
      } else {
         this.scope.online = true;
      }

      console.log(this.scope.args.widgetTrackingName + ' online:', this.scope.online);
      if ( !this.scope.online ) {
         this.handleError('widget, offline');
      }
   }

   handleError(prm) {
      console.warn('Cannot load ', prm, ', removing ' + this.scope.args.widgetTrackingName);
      widgetModule.removeWidget();
   }

   isMobile() {
      var testBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      this.mainElement = document.getElementById('group-winner');
      return this.mainElement.offsetWidth <= 768 && ('ontouchstart' in window) && testBrowser;
   }

}

