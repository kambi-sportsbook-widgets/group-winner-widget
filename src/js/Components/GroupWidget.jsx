import React from 'react';
import { widgetModule } from 'kambi-widget-core-library';
import { TabPagination, IconHeader } from 'kambi-widget-components';
import BoxContainer from './BoxContainer/BoxContainer';
import CountryList from './CountryList/CountryList';
import CountryListElement from './CountryList/CountryListElement/CountryListElement';
import styles from './GroupWidget.scss';

class GroupWidget extends React.Component {

   constructor(props) {
      super(props);
      widgetModule.enableWidgetTransition(true);
   }

   /**
    * Called after component mounts
    */
   componentDidMount() {
      widgetModule.adaptWidgetHeight();
   }

   /**
    * Called after updating component's DOM.
    */
   componentDidUpdate() {
      widgetModule.adaptWidgetHeight();
   }

   render() {
      const list = [
         { title: 'A', content: 'Content A' },
         { title: 'B', content: 'Content B' },
         { title: 'C', content: 'Content C' },
         { title: 'D', content: 'Content D' },
         { title: 'E', content: 'Content E' },
         { title: 'F', content: 'Content F' },
         { title: 'G', content: 'Content G' },
         { title: 'H', content: 'Content H' },
         { title: 'I', content: 'Content I' },
         { title: 'J', content: 'Content J' },
         { title: 'K', content: 'Content K' },
         { title: 'L', content: 'Content L' },
         { title: 'M', content: 'Content M' },
         { title: 'O', content: 'Content O' },
         { title: 'P', content: 'Content P' },
         { title: 'R', content: 'Content R' },
      ];

      const renderTab = function (idx) {
         return (<div key={idx} className={styles.element}>{list[idx].title}</div>);
      };

      return (<div>
         <IconHeader
            iconCSSClasses='KambiWidget-card-border-color'
            iconPath='http://vector.stylove.com/images/small_1821.jpg'
            title='WORLD CUP QUALIFYING - EUROPE'
            subtitle='Group Winner' />
         <BoxContainer>
            <TabPagination>
               { list.map((element, index) => <div key={index}>{ element.content }</div>) }
            </TabPagination>
            <CountryList>
               <CountryListElement
                  key={'1'}
                  flagUrl='https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/1000000062.svg'
                  country='Poland' value='3.5' />
               <CountryListElement
                  key={'2'}
                  flagUrl='https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/1000000062.svg'
                  country='England' value='3.2' />
               <CountryListElement
                  key={'3'}
                  flagUrl='https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/1000000062.svg'
                  country='Netherlands' value='3.1' />
            </CountryList>
         </BoxContainer>
      </div>);
   }
}

export default GroupWidget;
