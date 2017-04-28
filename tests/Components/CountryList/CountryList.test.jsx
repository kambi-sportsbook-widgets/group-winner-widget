/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import CountryList from '../../../src/js/Components/CountryList/CountryList';

let renderer;

describe('CountryList.render()', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly when empty', () => {
      expect(renderer.render(
         <CountryList />
      )).toMatchSnapshot();
   });

   it('renders correctly when not empty', () => {
      expect(renderer.render(
         <CountryList>
            <li />
            <li />
         </CountryList>
      )).toMatchSnapshot();
   });

});
