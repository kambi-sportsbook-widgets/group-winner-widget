import React from 'react';
import ReactDOM from 'react-dom';
import GroupWidget from '../Components/GroupWidget';

class Widget {

   constructor(filters, parameters) {
      console.log(filters, parameters);
      this.render.call(this);
   }

   render() {
      ReactDOM.render(
         <GroupWidget />,
         document.getElementById('root'));
   }
}

export default Widget;
