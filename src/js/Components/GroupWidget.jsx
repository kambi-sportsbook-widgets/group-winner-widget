import React, { Component, PropTypes } from 'react';
import { widgetModule } from 'kambi-widget-core-library';
import { TabPagination, IconHeader } from 'kambi-widget-components';
import BoxContainer from './BoxContainer/BoxContainer';
import CountryList from './CountryList/CountryList';
import CountryListElement from './CountryList/CountryListElement/CountryListElement';
import styles from './GroupWidget.scss';

class GroupWidget extends Component {

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
      const renderTab = idx => <div key={idx} className={styles.tab}>{this.props.groups[idx].groupName}</div>;

      return (
         <div>
            <IconHeader
               iconCSSClasses='KambiWidget-card-border-color'
               iconPath='http://vector.stylove.com/images/small_1821.jpg'
               title={this.props.title}
               subtitle={this.props.tagline}
            />
            <BoxContainer>
               <TabPagination
                  renderTab={renderTab}
                  selected={this.props.nextMatchGroupIdx}
               >
                  {this.props.groups.map((group, i) => (
                     <CountryList key={i}>
                        {group.betOffers[0].outcomes.map(outcome => (
                           <CountryListElement
                              key={outcome.id}
                              flagUrl={`${this.props.flagUrl}${outcome.participantId}.svg`}
                              country={outcome.label}
                              outcome={outcome}
                           />
                        ))}
                     </CountryList>
                  ))}
               </TabPagination>
            </BoxContainer>
         </div>
      );
   }
}

GroupWidget.defaultProps = {
   nextMatchGroupIdx: 0
};

GroupWidget.propTypes = {
   groups: PropTypes.array,
   title: PropTypes.string,
   tagline: PropTypes.string,
   flagUrl: PropTypes.string,
   nextMatchGroupIdx: PropTypes.number
};

export default GroupWidget;
