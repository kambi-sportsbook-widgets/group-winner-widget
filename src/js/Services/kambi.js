import { offeringModule } from 'kambi-widget-core-library'

class KambiService {
  /**
   * Checks if given filter exists in current highlights.
   * @param {string} filter Filter to check
   * @returns {Promise.<boolean>}
   */
  static existsInHighlights(filter) {
    return offeringModule.getHighlight().then(response => {
      return !!response.groups.find(group =>
        group.pathTermId.match(
          new RegExp(`^/${filter.replace(/\/all/g, '')}(/all)*$`)
        )
      )
    })
  }

  /**
   * Fetches groups for given tournament.
   * @param {string} filter Tournament's filter
   * @param {number} criterionId Tournament's criterion identifier
   * @returns {Promise.<object[]>}
   */
  static getGroups(filter, criterionId) {
    return offeringModule
      .getEventsByFilter(`${filter}/all/competitions/`)
      .then(competitions => {
        return (
          competitions.events

            // must have exactly one betoffer
            .filter(event => event.betOffers && event.betOffers.length === 1)

            // criterion must match
            .filter(event => event.betOffers[0].criterion.id == criterionId)

            // set groupName
            .map(event => {
              const matches = event.event.englishName.match(/Group ([A-Z])/)

              if (!matches) {
                throw new Error(
                  `Cannot extract group letter from: ${event.event.englishName}`
                )
              }

              event.groupName = matches[1]

              return event
            })

            // sort based on groupName field
            .sort((a, b) => a.groupName.localeCompare(b.groupName))

            // remove the prelive event if there is one live of same groupName
            .filter((group, i, groups) => {
              if (group.betOffers[0].live) {
                return true
              }

              return !groups.find(
                g => g.groupName == group.groupName && g.betOffers[0].live
              )
            })

            // sort outcomes by odds value
            .map(group => {
              group.betOffers[0].outcomes.sort((a, b) => a.odds - b.odds)
              return group
            })
        )
      })
  }

  /**
   * Returns home team name of tournament's closest match.
   * @param {string} filter Tournament's filter
   * @returns {Promise.<string|null>}
   */
  static getNextMatchHomeName(filter) {
    return offeringModule
      .getEventsByFilter(`${filter}/all/matches/`)
      .then(matches => {
        const currentTime = Date.now()

        return matches.events
          .filter(
            m =>
              m.event.type === 'ET_MATCH' &&
              m.event.start &&
              m.event.start > currentTime
          )
          .sort((a, b) => a.event.start - b.event.start)
      })
      .then(matches => (matches.length > 0 ? matches[0].event.homeName : null))
  }
}

export default KambiService
