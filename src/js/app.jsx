import React from 'react';
import ReactDOM from 'react-dom';
import GroupWidget from './Components/GroupWidget';
import '../scss/app.scss';
import kambi from './Services/kambi';
import mobile from './Services/mobile';
import live from './Services/live';

class Widget {

   render() {
      ReactDOM.render(
         <GroupWidget />,
         document.getElementById('root'));
   }
}
