import { eventsModule } from 'kambi-widget-core-library';

/**
 * Maps event identifiers to update methods.
 * @type {object<number,{onUpdate: function, onRemoved: function}>}
 */
const handlers = {};

/**
 * Unsubscribes from given events.
 * @param {number[]} eventIds Event identifiers array
 */
const unsubscribeFromEvents = function(eventIds) {
   eventIds.map((eventId) => {
      eventsModule.unsubscribe(`LIVE:EVENTDATA:${eventId}`, handlers[eventId].onUpdate);
      eventsModule.unsubscribe(`LIVE:EVENTDATA:${eventId}:REMOVED`, handlers[eventId].onRemoved);
      delete handlers[eventId];
      console.debug('unsubscribed', eventId);
   });
};

/**
 * Creates handler for incoming event's live data.
 * Ensures if given event is still "live".
 * @param {function} onUpdate Called on event's live data update
 * @returns {function(object)}
 */
const createEventUpdateHandler = function(onUpdate) {
   return (liveEventData) => {
      onUpdate(liveEventData);

      if (!liveEventData.open) {
         handlers[liveEventData.eventId].onRemoved(liveEventData.eventId);
      }
   }
};

/**
 * Creates handler for event removed.
 * @param {number[]} activeEventIds Event identifiers for drain watchlist
 * @param {function} onDrained Called when there is no active events anymore
 * @returns {function(number)}
 */
const createEventRemovedHandler = function(activeEventIds, onDrained) {
   return (eventId) => {
      unsubscribeFromEvents([eventId]);

      const idx = activeEventIds.indexOf(eventId);

      if (idx == -1) {
         console.warn(`Event not found in active events set: ${eventId}`);
         return;
      }

      activeEventIds.splice(idx, 1);

      if (activeEventIds.length == 0) {
         onDrained();
      }
   };
};

/**
 * Subscribes for receiving updates on given events.
 * @param {number[]} eventIds Event identifiers
 * @param {function(object)} onUpdate Called on particular event update
 * @param {function} onDrained Called when none of given events is live anymore
 */
const subscribeToEvents = function(eventIds, onUpdate, onDrained) {
   const activeEventIds = eventIds.slice();

   eventIds.map((eventId) => {
      handlers[eventId] = {
         onUpdate: createEventUpdateHandler.call(handlers[eventId], onUpdate),
         onRemoved: createEventRemovedHandler(activeEventIds, onDrained)
      };

      eventsModule.subscribe(`LIVE:EVENTDATA:${eventId}`, handlers[eventId].onUpdate);
      eventsModule.subscribe(`LIVE:EVENTDATA:${eventId}:REMOVED`, handlers[eventId].onRemoved);

      console.debug('subscribed', eventId);
   });
};

export default { subscribeToEvents, unsubscribeFromEvents };
