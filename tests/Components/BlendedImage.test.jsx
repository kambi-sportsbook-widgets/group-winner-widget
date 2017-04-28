/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import BlendedImage from '../../src/js/Components/BlendedImage';

let renderer;

describe('BlendedImage.render()', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly with default props', () => {
      expect(renderer.render(
         <BlendedImage imgPath="test/image/path.jpg" />
      )).toMatchSnapshot();
   });

});
