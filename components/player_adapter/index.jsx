'use strict';

/* global window */

// The `PlayerAdapter` initializes and interacts with the `VersalPlayerAPI` and
// provides services to the main app by handling callbacks and setting props on
// it's child component sheltering the main app from knowing much about the
// scary world outside of React.

var React = require('react/addons');

var PlayerAPIMixin = require('../../mixins/player_api');
var PlayerStateMixin = require('../../mixins/player_state');
var PlayerStateReadyMixin = require('../../mixins/player_state_ready');
var PlayerStateRendererMixin = require('../../mixins/player_state_renderer');

// Important: polyfills `Promise` globally
if (!window.Promise) {
  window.Promise = require('es6-promise').Promise;
}

var PlayerAdapter = React.createClass({
  mixins: [
    // Initialize a player api instance
    PlayerAPIMixin,
    // Sync state from player to `this.state`
    PlayerStateMixin,
    // Set `this.state.playerStateReady` to true when all data is ready
    PlayerStateReadyMixin,
    // Expose a renderer that renders the app component with the player's state
    PlayerStateRendererMixin
  ],

  getDefaultProps: function() {
    return {
      propertySheets: {}
    };
  },

  propTypes: {
    propertySheets: React.PropTypes.object,
    // `PlayerAdapter` expects your app's root component as it's child, and
    // nothing else.
    children: React.PropTypes.element.isRequired
  },

  componentDidMount: function() {
    this.player.setPropertySheetAttributes(this.props.propertySheets);
    this.player.startListening();
    this.player.watchBodyHeight();
  },

  componentDidUnmount: function() {
    this.player.unwatchBodyHeight();
  },

  saveAttributes: function(attributes) {
    this.setState(attributes);
    this.player.setAttributes(attributes);
  },

  saveLearnerState: function(learnerState) {
    this.setState(learnerState);
    this.player.setLearnerState(learnerState);
  },

  render: function() {
    var additionalProps = {
      saveLearnerState: this.saveLearnerState,
      saveAttributes: this.saveAttributes
    };
    return this.renderAppComponentWithPlayerState(additionalProps);
  }
});

module.exports = PlayerAdapter;
