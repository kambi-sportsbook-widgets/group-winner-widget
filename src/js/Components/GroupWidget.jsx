import React, { Component, PropTypes } from 'react';
import { widgetModule } from 'kambi-widget-core-library';
import { IconHeader, TabPagination } from 'kambi-widget-components';
import CountryList from './CountryList/CountryList';
import CountryListElement from './CountryList/CountryListElement/CountryListElement';
import styles from './GroupWidget.scss';

/**
 * Navigates to given group (event) page.
 * @param {object} group Tournament group (event entity)
 */
const onGroupClick = function(group) {
   if (group.event.openForLiveBetting === true) {
      widgetModule.navigateToLiveEvent(group.event.id);
   } else {
      widgetModule.navigateToEvent(group.event.id);
   }
};

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
            <TabPagination
               renderTab={renderTab}
               selected={this.props.selected}
            >
               {this.props.groups.map(group => (
                  <CountryList key={group.event.id}>
                     {group.betOffers[0].outcomes.map(outcome => (
                        <CountryListElement
                           key={outcome.id}
                           flagUrl={`${this.props.flagUrl}${outcome.participantId}.svg`}
                           country={outcome.label}
                           outcome={outcome}
                           onClick={onGroupClick.bind(null, group)}
                        />
                     ))}
                  </CountryList>
               ))}
            </TabPagination>
         </div>
      );
   }
}

GroupWidget.defaultProps = {
   selected: 0
};

GroupWidget.propTypes = {

   /**
    * Tournament groups array (event entities)
    */
   groups: PropTypes.array.isRequired,

   /**
    * Widget's title. Will be figured out if not provided explicitly.
    */
   title: PropTypes.string,

   /**
    * Widget's tag line. Will be figured out if not provided explicitly.
    */
   tagline: PropTypes.string,

   /**
    * Base URL of country flags
    */
   flagUrl: PropTypes.string,

   /**
    * Selected group index (default to 0)
    */
   selected: PropTypes.number
};

export default GroupWidget;
