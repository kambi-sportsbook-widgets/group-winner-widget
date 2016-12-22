import React from 'react';
import ReactDOM from 'react-dom';
import GroupWidget from '../Components/GroupWidget';

class Widget {

   constructor() {
      this.render();
   }

   render() {
      ReactDOM.render(
         <GroupWidget />,
         document.getElementById('root'));
   }
}

export default Widget;
