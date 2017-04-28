import React from 'react';
import ReactDOM from 'react-dom';
import Widget from '../../src/js/Widget';
import kambi from '../../src/js/Services/kambi'
import { eventsModule } from 'kambi-widget-core-library';

jest.mock('../../src/js/Services/kambi', () => ({
   getGroups: jest.fn(),
   getNextMatchHomeName: jest.fn()
}));

jest.mock('react-dom', () => ({
   render: jest.fn()
}));

jest.mock('kambi-widget-core-library', () => ({
   eventsModule: {
      subscribe: jest.fn()
   }
}));

ReactDOM.render = jest.fn();

const originalConsoleError = console.error;

describe('Widget.init()', () => {

   afterEach(() => {
      kambi.getGroups = jest.fn();
      kambi.getNextMatchHomeName = jest.fn();
      eventsModule.subscribe = jest.fn();
      ReactDOM.render.mockClear();
      console.error = originalConsoleError;
   });

   it('renders to DOM', () => {
      kambi.getGroups = jest.fn(() => Promise.resolve([
         { betOffers: [ { outcomes: [ { label: 'Poland' } ] } ] }
      ]));
      kambi.getNextMatchHomeName = jest.fn(() => Promise.resolve('Poland'));

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         title: 'Test title',
         tagline: 'Test tagline',
         removeWidget: () => {}
      });

      return widget.init('test', 100)
         .then(() => {
            expect(kambi.getGroups).toHaveBeenCalledTimes(1);
            expect(kambi.getGroups).toHaveBeenLastCalledWith('test', 100);
            expect(kambi.getNextMatchHomeName).toHaveBeenCalledTimes(1);
            expect(kambi.getNextMatchHomeName).toHaveBeenLastCalledWith('test');
            expect(ReactDOM.render).toHaveBeenCalledTimes(1);
         });
   });

   it('handles live event updates', () => {
      kambi.getGroups = jest.fn(() => Promise.resolve([
         { event: { id: 1000 }, betOffers: [ { live: true, outcomes: [ { label: 'Poland' } ] } ] }
      ]));
      kambi.getNextMatchHomeName = jest.fn(() => Promise.resolve('Poland'));

      let mockLiveEventHandler;
      eventsModule.subscribe = jest.fn((event, handler) => {
         if (event === 'LIVE:EVENT:1000') {
            mockLiveEventHandler = handler;
         }
      });

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         title: 'Test title',
         tagline: 'Test tagline',
         removeWidget: () => {}
      });

      return widget.init('test', 100)
         .then(() => {
            expect(eventsModule.subscribe).toHaveBeenCalledTimes(2);
            expect(ReactDOM.render).toHaveBeenCalledTimes(1);
            mockLiveEventHandler({ betOffers: [ { outcomes: [ { odds: 20 }, { odds: 10 } ] } ] });
            expect(ReactDOM.render).toHaveBeenCalledTimes(2);
         });
   });

   it('removes finished live event correctly from list', () => {
      kambi.getGroups = jest.fn(() => Promise.resolve([
         { event: { id: 1000 }, betOffers: [ { live: true, outcomes: [ { label: 'Poland' } ] } ] },
         { event: { id: 2000 }, betOffers: [ { live: true, outcomes: [ { label: 'Poland' } ] } ] }
      ]));
      kambi.getNextMatchHomeName = jest.fn(() => Promise.resolve('Poland'));

      let mockLiveEventRemovedHandler;
      eventsModule.subscribe = jest.fn((event, handler) => {
         if (event === 'LIVE:EVENT:1000:REMOVED') {
            mockLiveEventRemovedHandler = handler;
         }
      });

      const mockRemoveWidget = jest.fn();

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         title: 'Test title',
         tagline: 'Test tagline',
         removeWidget: mockRemoveWidget
      });

      return widget.init('test', 100)
         .then(() => {
            mockLiveEventRemovedHandler();
            expect(mockRemoveWidget).not.toHaveBeenCalled();
         });
   });

   it('removes itself when all group were removed through live events', () => {
      kambi.getGroups = jest.fn(() => Promise.resolve([
         { event: { id: 1000 }, betOffers: [ { live: true, outcomes: [ { label: 'Poland' } ] } ] }
      ]));
      kambi.getNextMatchHomeName = jest.fn(() => Promise.resolve('Poland'));

      let mockLiveEventRemovedHandler;
      eventsModule.subscribe = jest.fn((event, handler) => {
         if (event === 'LIVE:EVENT:1000:REMOVED') {
            mockLiveEventRemovedHandler = handler;
         }
      });

      const mockRemoveWidget = jest.fn();

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         title: 'Test title',
         tagline: 'Test tagline',
         removeWidget: mockRemoveWidget
      });

      return widget.init('test', 100)
         .then(() => {
            mockLiveEventRemovedHandler();
            expect(mockRemoveWidget).toHaveBeenCalledTimes(1);

            // handles duplicate events correctly
            mockLiveEventRemovedHandler();
         });
   });

   it('infers title when one is not given arbitrarily', () => {
      const mockGetGroup = jest.fn(() => 'Test event group');

      kambi.getGroups = jest.fn(() => Promise.resolve([
         { event: { get group() { return mockGetGroup(); } }, betOffers: [ { outcomes: [ { label: 'Poland' } ] } ] }
      ]));
      kambi.getNextMatchHomeName = jest.fn(() => Promise.resolve('Poland'));

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         tagline: 'Test tagline',
         removeWidget: () => {}
      });

      return widget.init('test', 100)
         .then(() => expect(mockGetGroup).toHaveBeenCalledTimes(1));
   });

   it('infers tagline when one is not given arbitrarily', () => {
      const mockGetCriterionLabel = jest.fn(() => 'Test criterion label');

      kambi.getGroups = jest.fn(() => Promise.resolve([
         { betOffers: [ { criterion: { get label() { return mockGetCriterionLabel(); } }, outcomes: [ { label: 'Poland' } ] } ] }
      ]));
      kambi.getNextMatchHomeName = jest.fn(() => Promise.resolve('Poland'));

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         title: 'Test title',
         removeWidget: () => {}
      });

      return widget.init('test', 100)
         .then(() => expect(mockGetCriterionLabel).toHaveBeenCalledTimes(1));
   });

   it('displays first group when there is no next match', () => {
      kambi.getGroups = jest.fn(() => Promise.resolve([
         { betOffers: [ { outcomes: [ { label: 'Poland' } ] } ] }
      ]));
      kambi.getNextMatchHomeName = jest.fn(() => Promise.resolve(null));

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         title: 'Test titile',
         tagline: 'Test tagline',
         removeWidget: () => {}
      });

      return widget.init('test', 100)
         .then(() => expect(ReactDOM.render).toHaveBeenCalledTimes(1));
   });

   it('displays first group when nextMatchHomeName wasn\'t found in groups', () => {
      kambi.getGroups = jest.fn(() => Promise.resolve([
         { betOffers: [ { outcomes: [ { label: 'Poland' } ] } ] }
      ]));
      kambi.getNextMatchHomeName = jest.fn(() => Promise.resolve('Sweden'));

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         title: 'Test titile',
         tagline: 'Test tagline',
         removeWidget: () => {}
      });

      return widget.init('test', 100)
         .then(() => expect(ReactDOM.render).toHaveBeenCalledTimes(1));
   });

   it('removes itself when there is no groups', () => {
      kambi.getGroups = jest.fn(() => Promise.resolve([]));
      const mockRemoveWidget = jest.fn();
      console.error = jest.fn((message) => expect(message).toMatchSnapshot());

      const widget = new Widget({
         flagUrl: '/path/to/flags',
         title: 'Test title',
         tagline: 'Test tagline',
         removeWidget: mockRemoveWidget
      });

      return widget.init('test', 100)
         .then(() => {
            expect(mockRemoveWidget).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            //expect(kambi.getGroups).toHaveBeenCalledTimes(1);
            //expect(kambi.getGroups).toHaveBeenLastCalledWith('test', 100);
         });
   });

});
