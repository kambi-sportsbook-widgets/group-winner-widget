import kambi from '../../src/js/Services/kambi';
import { coreLibrary, offeringModule, widgetModule } from 'kambi-widget-core-library';

const originalDateNow = window.Date.now;

jest.mock('kambi-widget-core-library', () => ({
   coreLibrary: {
      config: {
         routeRoot: ''
      }
   },
   offeringModule: {
      getHighlight: jest.fn(),
      getEventsByFilter: jest.fn()
   },
   widgetModule: {
      createFilterUrl: jest.fn()
   }
}));

const mockHighlightGroup = {pathTermId: '/test'};

describe('kambi.existsInHighlights()', () => {

   afterEach(() => {
      offeringModule.getHighlight.mockClear();
   });

   it('returns true if given filter is present in highlights', () => {
      offeringModule.getHighlight = jest.fn(() => new Promise(resolve =>
         resolve({ groups: [mockHighlightGroup] })));

      return kambi.existsInHighlights('test')
         .then((result) => {
            expect(result).toBe(true);
            expect(offeringModule.getHighlight).toHaveBeenCalledTimes(1);
         });
   });

   it('returns false if given filter is not present in highlights', () => {
      offeringModule.getHighlight = jest.fn(() => new Promise(resolve =>
         resolve({ groups: [mockHighlightGroup] })));

      return kambi.existsInHighlights('test_non_existing')
         .then((result) => {
            expect(result).toBe(false);
            expect(offeringModule.getHighlight).toHaveBeenCalledTimes(1);
         });
   });

});

describe('kambi.getGroups()', () => {

   afterEach(() => {
      offeringModule.getEventsByFilter = jest.fn();
   });

   it('finds next match team name correctly', () => {
      offeringModule.getEventsByFilter = jest.fn(() => new Promise(resolve =>
         resolve({
            events: [
               { betOffers: [] },
               { betOffers: [ {}, {} ] },
               { betOffers: [ { criterion: { id: 200 } } ]},
               { betOffers: [ { criterion: { id: 100 }, outcomes: [{odds: 20}, {odds: 10}] } ], event: { englishName: 'Group A (World Cup Qualification UEFA 2018)' }},
               { betOffers: [ { criterion: { id: 100 }, outcomes: [{odds: 20}, {odds: 10}] } ], event: { englishName: '(World Cup Qualification UEFA 2018) Group B' }},
               { betOffers: [ { criterion: { id: 100 }, live: true, outcomes: [{odds: 20}, {odds: 10}] } ], event: { englishName: '(World Cup Qualification UEFA 2018) Group C (World Cup Qualification UEFA 2018)' }}
            ]
         })));

      return kambi.getGroups('test', 100)
         .then((result) => {
            expect(result).toMatchSnapshot();
            expect(offeringModule.getEventsByFilter).toHaveBeenCalledTimes(1);
            expect(offeringModule.getEventsByFilter).toHaveBeenCalledWith('test/all/competitions/');
         });
   });

   it('throws exception when group name cannot be found', () => {
      offeringModule.getEventsByFilter = jest.fn(() => new Promise(resolve =>
         resolve({
            events: [
               { betOffers: [ { criterion: { id: 100 }, outcomes: [{odds: 20}, {odds: 10}] } ], event: { englishName: 'group A (World Cup Qualification UEFA 2018)' }}
            ]
         })));

      expect.assertions(1);

      return kambi.getGroups('test', 100)
         .catch(e => expect(e).toMatchSnapshot());
   });

});

describe('kambi.getNextMatchHomeName()', () => {

   beforeEach(() => {
      window.Date.now = () => 10;
   });

   afterEach(() => {
      offeringModule.getEventsByFilter.mockClear();
      window.Date.now = originalDateNow;
   });

   it('finds next match team name correctly', () => {
      offeringModule.getEventsByFilter = jest.fn(() => new Promise(resolve =>
         resolve({
            events: [
               { event: { type: 'ET_NOT_MATCH' } },
               { event: { type: 'ET_MATCH' } },
               { event: { type: 'ET_MATCH', start: 5 } },
               { event: { type: 'ET_MATCH', start: 15, homeName: 'Poland' } },
               { event: { type: 'ET_MATCH', start: 20, homeName: 'Sweden' } }
            ]
         })));

      return kambi.getNextMatchHomeName('test')
         .then((result) => {
            expect(result).toBe('Poland');
            expect(offeringModule.getEventsByFilter).toHaveBeenCalledTimes(1);
            expect(offeringModule.getEventsByFilter).toHaveBeenCalledWith('test/all/matches/');
         });
   });

   it('returns null when there is no upcoming matches', () => {
      offeringModule.getEventsByFilter = jest.fn(() => new Promise(resolve =>
         resolve({ events: [ ] })));

      return kambi.getNextMatchHomeName('test')
         .then(result => expect(result).toBe(null));
   });

});
