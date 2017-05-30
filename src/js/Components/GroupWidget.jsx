import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { widgetModule } from 'kambi-widget-core-library';
import { IconHeader, ScrolledList, TabPagination } from 'kambi-widget-components';
import isMobile from '../Services/mobile';
import BlendedImage from './BlendedImage';
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

/**
 * Called after switching the group.
 * @param {number} idx Group index
 */
const onGroupChange = function(idx) {
   widgetModule.adaptWidgetHeight();
};

class GroupWidget extends Component {

   /**
    * Constructs.
    * @param {object} props Component properties
    */
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
    * Renders widget.
    * @returns {XML}
    */
   render() {
      const renderTab = idx => <div key={idx} className={styles.tab}>{this.props.groups[idx].groupName}</div>;

      return (
         <div>
            <IconHeader title={this.props.title} subtitle={this.props.tagline}>
               <BlendedImage imgPath='assets/football.svg' />
            </IconHeader>
            <TabPagination
               renderTab={renderTab}
               selected={this.props.selected}
               renderTabList={args => <ScrolledList {...args} showControls={!isMobile()} />}
               onTabChange={onGroupChange}
            >
               {this.props.groups.map(group => (
                  <CountryList key={group.event.id}>
                     {group.betOffers[0].outcomes.map(outcome => (
                        <CountryListElement
                           key={outcome.id}
                           flagUrl={`assets/flags/${outcome.participantId}.svg`}
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
    * Widget's title
    */
   title: PropTypes.string.isRequired,

   /**
    * Widget's tag line
    */
   tagline: PropTypes.string.isRequired,

   /**
    * Selected group index (default to 0)
    */
   selected: PropTypes.number

};

export default GroupWidget;
