/* eslint-env jest */
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { mount, shallow } from 'enzyme'
import GroupWidget from '../../src/js/Components/GroupWidget'
import { widgetModule } from 'kambi-widget-core-library'

let renderer

describe('', () => {
  it('', () => {})
})

// jest.mock('kambi-widget-core-library', () => ({
//    widgetModule: {
//       navigateToEvent: jest.fn(),
//       navigateToLiveEvent: jest.fn(),
//       enableWidgetTransition: jest.fn(),
//       adaptWidgetHeight: jest.fn(),
//       betslipIds: []
//    },
//    coreLibrary: {
//       config: {
//          oddsFormat: 'decimal'
//       }
//    },
//    utilModule: {
//       getOddsDecimalValue: _ => _.toFixed(1),
//       getOutcomeLabel: () => 'Outcome label from util'
//    },
//    eventsModule: {
//       subscribe: jest.fn(),
//       unsubscribe: jest.fn()
//    }
// }));

// const mockGroups = [
//    {
//       groupName: 'Test group name',
//       event: { id: 1000 },
//       betOffers: [{
//          outcomes: [
//             {
//                id: 1100,
//                participantId: 1110,
//                label: 'Test outcome label'
//             },
//             {
//                id: 1200,
//                participantId: 1220,
//                label: 'Test outcome label 2'
//             }
//          ]
//       }]
//    },
//    {
//       groupName: 'Test group name',
//       event: {
//          id: 2000,
//          openForLiveBetting: true
//       },
//       betOffers: [{
//          outcomes: [
//             {
//                id: 2100,
//                participantId: 2110,
//                label: 'Test outcome label'
//             },
//             {
//                id: 2200,
//                participantId: 2220,
//                label: 'Test outcome label 2'
//             }
//          ]
//       }]
//    }
// ];

// jest.useFakeTimers();

// describe('GroupWidget.render()', () => {

//    beforeEach(() => {
//       renderer = new ReactShallowRenderer();
//    });

//    it('renders correctly with default props', () => {
//       expect(renderer.render(
//          <GroupWidget
//             groups={[]}
//             title="Test title"
//             tagline="Test subtitle"
//             flagUrl="/base/flags/path/"
//          />
//       )).toMatchSnapshot();
//    });

//    it('renders correctly with groups', () => {
//       expect(renderer.render(
//          <GroupWidget
//             groups={mockGroups}
//             title="Test title"
//             tagline="Test subtitle"
//             flagUrl="/base/flags/path/"
//          />
//       )).toMatchSnapshot();
//    });

//    it('renders correctly with initially selected group', () => {
//       expect(renderer.render(
//          <GroupWidget
//             groups={mockGroups}
//             title="Test title"
//             tagline="Test subtitle"
//             flagUrl="/base/flags/path/"
//             selected={1}
//          />
//       )).toMatchSnapshot();
//    });

// });

// describe('GroupWidget clicks', () => {

//    beforeAll(() => {
//       widgetModule.navigateToEvent.mockClear();
//       widgetModule.navigateToLiveEvent.mockClear();
//    });

//    it('handles click on regular event correctly', () => {
//       const wrapper = mount(
//          <GroupWidget
//             groups={mockGroups}
//             title="Test title"
//             tagline="Test subtitle"
//             flagUrl="/base/flags/path/"
//          />
//       );

//       expect(widgetModule.navigateToEvent).not.toHaveBeenCalled();
//       wrapper.find('.row .flag').first().simulate('click');
//       expect(widgetModule.navigateToEvent).toHaveBeenCalledTimes(1);
//    });

//    it('handles click on live event correctly', () => {
//       const wrapper = mount(
//          <GroupWidget
//             groups={mockGroups}
//             title="Test title"
//             tagline="Test subtitle"
//             flagUrl="/base/flags/path/"
//             selected={1} // <- HERE
//          />
//       );

//       expect(widgetModule.navigateToLiveEvent).not.toHaveBeenCalled();
//       wrapper.find('.row .flag').first().simulate('click');
//       expect(widgetModule.navigateToLiveEvent).toHaveBeenCalledTimes(1);
//    });

// });

// describe('GroupWidget height and transition', () => {

//    beforeEach(() => {
//       widgetModule.adaptWidgetHeight.mockClear();
//       widgetModule.enableWidgetTransition.mockClear();
//    });

//    it('initializes correctly', () => {
//       expect(widgetModule.enableWidgetTransition).not.toHaveBeenCalled();
//       expect(widgetModule.adaptWidgetHeight).not.toHaveBeenCalled();

//       const wrapper = mount(
//          <GroupWidget
//             groups={mockGroups}
//             title="Test title"
//             tagline="Test subtitle"
//             flagUrl="/base/flags/path/"
//          />
//       );

//       expect(widgetModule.enableWidgetTransition).toHaveBeenCalledTimes(1);
//       expect(widgetModule.adaptWidgetHeight).toHaveBeenCalledTimes(1);
//    });

//    it('updates correctly', () => {
//       expect(widgetModule.adaptWidgetHeight).not.toHaveBeenCalled();

//       const wrapper = mount(
//          <GroupWidget
//             groups={mockGroups}
//             title="Test title"
//             tagline="Test subtitle"
//             flagUrl="/base/flags/path/"
//          />
//       );

//       expect(widgetModule.adaptWidgetHeight).toHaveBeenCalledTimes(1);

//       wrapper.find('ItemContainer').first().simulate('click');

//       jest.runOnlyPendingTimers();

//       expect(widgetModule.adaptWidgetHeight).toHaveBeenCalledTimes(2);
//    });

// });
