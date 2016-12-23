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
      console.log('props', this.props);
   }

   /**
    * Called after updating component's DOM.
    */
   componentDidUpdate() {
      widgetModule.adaptWidgetHeight();
      console.log('props', this.props);
   }

   render() {
      const list = this.props.data;

      const renderTab = function (idx) {
         return (<div key={idx} className={styles.element}>{list[idx].groupName}</div>);
      };

      return (<div>
         <IconHeader
            iconCSSClasses='KambiWidget-card-border-color'
            iconPath='http://vector.stylove.com/images/small_1821.jpg'
            title='WORLD CUP QUALIFYING - EUROPE'
            subtitle='Group Winner' />
         <BoxContainer>
            <TabPagination renderTab={renderTab}>
               { list.map((group, i) =>
                  <div key={i}>
                     <CountryList>
                        { group.outcomes.map((outcome, j) =>
                           (<CountryListElement
                              key={j}
                              flagUrl='https://d1fqgomuxh4f5p.cloudfront.net/customcss/group-winner-widget/flags/1000000062.svg'
                              country={outcome.label} value='3.5' />)) }
                     </CountryList>
                  </div>)
               }
            </TabPagination>
         </BoxContainer>
      </div>);
   }
}

GroupWidget.propTypes = {
   data: React.PropTypes.array
};

export default GroupWidget;
