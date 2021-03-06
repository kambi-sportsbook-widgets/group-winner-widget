import React from 'react'
import ReactDOM from 'react-dom'
import { eventsModule } from 'kambi-widget-core-library'
import KambiService from '../Services/kambi'
import GroupWidget from '../Components/GroupWidget'

/**
 * Group Winner widget
 */
class Widget {
  /**
   * Constructor
   * @param {string?} title Widget title (will be figured out if omitted)
   * @param {string?} tagline Widget tag line (will be figured out if omitted)
   * @param {function} removeWidget Remove widget callback
   * @param {HTMLElement} rootEl Widget's DOM mount point
   */
  constructor({
    title,
    tagline,
    removeWidget,
    rootEl = document.getElementById('root'),
  }) {
    this.rootEl = rootEl
    this.forcedTitle = title
    this.forcedTagline = tagline
    this.removeWidget = removeWidget

    this.groups = []
    this.nextMatchHomeName = null
  }

  /**
   * Initializes widget with data fetched from Kambi API.
   * @param {string} filter Tournament filter
   * @param {number} criterionId Tournament criterion identifier
   * @returns {Promise}
   */
  init(filter, criterionId) {
    return Promise.all([
      KambiService.getGroups(filter, criterionId),
      KambiService.getNextMatchHomeName(filter),
    ]).then(([groups, nextMatchHomeName]) => {
      if (!groups.length) {
        console.error('No tournament groups found, widget removing itself')
        this.removeWidget()
        return
      }

      this.groups = groups
      this.nextMatchHomeName = nextMatchHomeName

      // setup live group polling
      this.groups
        .filter(group => group.betOffers[0].live)
        .forEach(this.subscribeToLiveGroup.bind(this))

      this.render()
    })
  }

  /**
   * Holds team's home name of closest tournament's match.
   * @returns {number|null}
   */
  get nextMatchGroupIdx() {
    if (!this.nextMatchHomeName) {
      return 0
    }

    for (let i = 0; i < this.groups.length; i++) {
      const outcome = this.groups[i].betOffers[0].outcomes.find(
        outcome => outcome.label === this.nextMatchHomeName
      )

      if (outcome) {
        return i
      }
    }

    return 0
  }

  /**
   * Widget's title
   * @returns {string|null}
   */
  get title() {
    if (this.forcedTitle) {
      return this.forcedTitle
    }

    return this.groups[0].event.group
  }

  /**
   * Widget's tagline
   * @returns {string|null}
   */
  get tagline() {
    if (this.forcedTagline) {
      return this.forcedTagline
    }

    return this.groups[0].betOffers[0].criterion.label
  }

  /**
   * Removes given group from widget.
   * @param {object} group Tournament group (event entity)
   */
  removeGroup(group) {
    const idx = this.groups.indexOf(group)

    if (idx > -1) {
      this.groups.splice(idx, 1)
    }

    if (!this.groups.length) {
      this.removeWidget()
    }
  }

  /**
   * Subscribes given group to live updates.
   * @param {object} group Tournament group (event entity)
   */
  subscribeToLiveGroup(group) {
    eventsModule.subscribe(`LIVE:EVENT:${group.event.id}`, liveEvent => {
      liveEvent.betOffers[0].outcomes.sort((a, b) => a.odds - b.odds)
      group.betOffers = liveEvent.betOffers
      this.render()
    })

    eventsModule.subscribe(
      `LIVE:EVENT:${group.event.id}:REMOVED`,
      this.removeGroup.bind(this, group)
    )
  }

  /**
   * Renders widget.
   */
  render() {
    ReactDOM.render(
      <GroupWidget
        groups={this.groups}
        selected={this.nextMatchGroupIdx}
        title={this.title}
        tagline={this.tagline}
      />,
      this.rootEl
    )
  }
}

export default Widget
