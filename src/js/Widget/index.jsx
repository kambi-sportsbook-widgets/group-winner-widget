import React from 'react';
import ReactDOM from 'react-dom';
import GroupWidget from '../Components/GroupWidget';

class Widget {

   constructor({ data }) {
      this.data = data;
      this.render();
   }

   render() {
      ReactDOM.render(
         <GroupWidget data={this.data} />,
         document.getElementById('root'));
   }
}

export default Widget;
