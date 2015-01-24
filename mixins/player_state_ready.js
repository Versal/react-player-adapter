'use strict';

// Tracks a boolean in `this.state` called `playerStateReady` so the component
// knows that initial state has been set.

var PlayerStateMixin = {
  getInitialState: function() {
    return {
      playerStateReady: false
    };
  },

  componentWillMount: function() {
    this._waitForStateReadiness();
  },

  // Create a promise that waits for an event to fire once
  _waitForEvent: function(eventName) {
    var player = this.player;

    return new Promise(function(resolve, reject) {
      player.once(eventName, resolve);
      setTimeout(function() {
        player.removeListener(eventName, resolve);
        reject(new Error(`Timed out waiting for ${eventName}`));
      }, 100);
    });
  },

  // Wait for all the data to be ready and update the flag
  _waitForStateReadiness: function() {
    Promise.all([
      this._waitForEvent('attributesChanged'),
      this._waitForEvent('learnerStateChanged'),
      this._waitForEvent('editableChanged')
    ]).then(function() {
      this.setState({ playerStateReady: true });
    }.bind(this), function(err) {
      this.setState({ playerStateReady: false });
    }.bind(this));
  }
};

module.exports = PlayerStateMixin;
