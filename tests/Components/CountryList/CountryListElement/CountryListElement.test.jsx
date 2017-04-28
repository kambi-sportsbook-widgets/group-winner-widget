/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { shallow } from 'enzyme';
import CountryListElement from '../../../../src/js/Components/CountryList/CountryListElement/CountryListElement';

let renderer;

describe('CountryListElement.render()', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly', () => {
      expect(renderer.render(
         <CountryListElement
            country="Poland!"
            flagUrl="url/to/flag/on/poland.jpg"
            outcome={{id: 100}}
            onClick={() => {}}
         />
      )).toMatchSnapshot();
   });

});

describe('CountryListElement.onClick()', () => {

   it('handles clicks correctly', () => {
      const mockOnClick = jest.fn();

      const wrapper = shallow(
         <CountryListElement
            country="Poland!"
            flagUrl="url/to/flag/on/poland.jpg"
            outcome={{id: 100}}
            onClick={mockOnClick}
         />
      );

      expect(mockOnClick).not.toHaveBeenCalled();

      wrapper.find('.flag').simulate('click');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      mockOnClick.mockClear();

      wrapper.find('.country').simulate('click');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      mockOnClick.mockClear();

      wrapper.find('.button').simulate('click');
      expect(mockOnClick).not.toHaveBeenCalled();
   });

});
