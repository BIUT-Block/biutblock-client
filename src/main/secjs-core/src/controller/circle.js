const SECUtil = require('@sec-block/secjs-util')
// const ntpPort = 123

class SECJSTimeCircle {
  /**
   * constructor of secjs time circle class
   * @param {string} config.timeServer the server's local; 'DE': German 'USA': USA 'ZH': China
   * @param {string} config.periodTime
   * @param {string} config.intervalTime
   * @param {string} config.timeResolution
   * @param {string} config.timeTolerance
   * @param {string} config.minGroup
   * @param {string} config.maxGroup
   * @param {string} config.ntpTryOut try out time for udp transport
   */
  constructor (config) {
    this.timeServer = config.timeServer
    this.circleStartTime = config.circleStartTime
    this.periodTime = config.periodTime
    this.intervalTime = config.intervalTime
    this.timeResolution = config.timeResolution
    this.timeTolerance = config.timeTolerance
    this.ntpTryOut = config.ntpTryOut // how many times should retry to get unix time

    this.minGroup = config.minGroup
    this.maxGroup = config.maxGroup
    this.numGroups = config.maxGroup - config.minGroup + 1
    this.timeDiff = null // the time difference between server unix time and local unix time
    this.calcTimeDifference(() => {
      this.currentPeriod = this.getCurrentPeriodNumber()
    })
  }

  /**
   * get local host unix time
   * @returns {number} local unix time
   */
  getLocalHostTime () {
    let localHostTime = 0
    try {
      localHostTime = Math.round((new Date()).getTime() / 1000)
    } catch (e) {
      console.log('ERROR：' + e)
    }
    return localHostTime
  }

  /**
   * get remote host unix time
   */
  getRemoteHostTime (callback, tryOut = 0) {
    SECUtil.asyncGetUTCTimeFromServer(this.timeServer).then((remoteHostTime) => {
      callback(null, remoteHostTime)
    }).catch((err) => {
      if (tryOut < this.ntpTryOut) {
        this.getRemoteHostTime(callback, tryOut + 1)
      } else {
        callback(err, null)
      }
    })
  }

  /**
   * calculate the time difference between server unix time and local unix time
   */
  calcTimeDifference (callback) {
    this.getRemoteHostTime((err, remoteTime) => {
      if (err) {
        callback(err)
      } else {
        let localTime = this.getLocalHostTime()
        this.timeDiff = remoteTime - localTime
        callback()
      }
    })
  }

  /**
   * get current period number
   */
  getCurrentPeriodNumber () {
    let currentCalibratedTime = this.getLocalHostTime() + this.timeDiff
    let periodNumber = Math.floor((currentCalibratedTime - this.circleStartTime) / this.periodTime)
    return periodNumber
  }

  /**
   * get host group id for current time
   */
  getHostGroupId (address) {
    if (typeof address !== 'string') {
      throw new Error('invalid input type, should be string')
    }
    let periodNumber = this.getCurrentPeriodNumber()
    periodNumber = periodNumber.toString()
    let hashResult = SECUtil.hasha256(address + periodNumber)

    // only uses first 12 bytes for my group id calculation
    hashResult = hashResult.slice(-6).readUIntBE(0, 6)
    let groupId = (hashResult % this.numGroups) + this.minGroup
    return groupId
  }

  /**
   * get group id for a specific time instant
   */
  getTimestampGroupId (address, timestamp) {
    if (typeof address !== 'string') {
      throw new Error('invalid input type, should be string')
    }
    let periodNumber = Math.floor((timestamp - this.circleStartTime) / this.periodTime)
    periodNumber = periodNumber.toString()
    let hashResult = SECUtil.hasha256(address + periodNumber)

    // only uses first 12 bytes for my group id calculation
    hashResult = hashResult.slice(-6).readUIntBE(0, 6)
    let groupId = (hashResult % this.numGroups) + this.minGroup
    return groupId
  }

  /**
   * get current working group id, return false if circle is in init status
   */
  getWorkingGroupId () {
    let currentCalibratedTime = this.getLocalHostTime() + this.timeDiff
    let currentPeriodRunTime = (currentCalibratedTime - this.circleStartTime) % this.periodTime
    let numGroupsAlreadyRun = Math.floor(currentPeriodRunTime / this.intervalTime)
    let currentWorkingGroup = (numGroupsAlreadyRun % this.numGroups) + this.minGroup
    return currentWorkingGroup
  }

  /**
   * get group id for a specific time instant
   */
  getTimestampWorkingGroupId (timestamp) {
    let currentPeriodRunTime = (timestamp - this.circleStartTime) % this.periodTime
    let numGroupsAlreadyRun = Math.floor(currentPeriodRunTime / this.intervalTime)
    let currentWorkingGroup = (numGroupsAlreadyRun % this.numGroups) + this.minGroup
    return currentWorkingGroup
  }

  /**
   * Verify if it is in a new period
   */
  isNextPeriod () {
    let periodNumber = this.getCurrentPeriodNumber()
    if (this.currentPeriod !== periodNumber) {
      this.currentPeriod = periodNumber
      return true
    }
    return false
  }

  /**
   * Verify whether the local time with offset is valid
   */
  checkTimeValid (callback) {
    this.getRemoteHostTime((err, remoteTime) => {
      if (err) {
        callback(err)
      }
      let localTime = this.getLocalHostTime()
      if (localTime + this.timeDiff - remoteTime >= this.timeTolerance) {
        callback(new Error('time is not well calibrated'))
      } else {
        callback()
      }
    })
  }

  getGroupStartTime (timestamp) {
    let currentPeriodRunTime = (timestamp - this.circleStartTime) % this.periodTime
    let currentGroupRunTime = currentPeriodRunTime % this.intervalTime
    let groupStartTime = timestamp - currentGroupRunTime
    return groupStartTime
  }

  /**
   * reset circle object
   */
  resetCircle (callback) {
    try {
      this.timeDiff = 0 // the time difference between server unix time and local unix time
      this.currentPeriod = this.getCurrentPeriodNumber()
      this.calcTimeDifference((err) => {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      })
    } catch (err) {
      callback(err)
    }
  }
}

module.exports = SECJSTimeCircle
