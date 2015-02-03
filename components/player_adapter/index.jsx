'use strict';

// The `PlayerAdapter` initializes and interacts with the `VersalPlayerAPI` and
// provides services to the main app by handling callbacks and setting props on
// it's child component sheltering the main app from knowing much about the
// scary world outside of React.

var runAsync = require('resistance');
var _ = require('underscore');
var React = require('react/addons');
var VersalPlayerAPI = require('versal-gadget-api/src/player-api');

var PlayerAdapter = React.createClass({
  // Setup

  getInitialState: function() {
    return {
      playerStateReady: false
    };
  },

  getDefaultProps: function() {
    return {
      propertySheets: {},
      debug: false
    };
  },

  propTypes: {
    debug: React.PropTypes.bool,
    propertySheets: React.PropTypes.object,
    // `PlayerAdapter` expects your app's root component as it's child, and
    // nothing else.
    children: React.PropTypes.element.isRequired
  },

  // Lifecycle

  componentWillMount: function() {
    this.player = new VersalPlayerAPI({
      debug: this.props.debug
    });

    // Track all player state changes
    this.player.on('attributesChanged', this._onStateChange);
    this.player.on('learnerStateChanged', this._onStateChange);
    this.player.on('editableChanged', this._onStateChange);

    this._waitForStateReadiness();
  },

  componentDidMount: function() {
    this.player.setPropertySheetAttributes(this.props.propertySheets);
    this.player.startListening();
    this.player.watchBodyHeight();
  },

  componentDidUnmount: function() {
    this.player.unwatchBodyHeight();

    // Stop tracking player state changes
    this.player.off('attributesChanged', this._onStateChange);
    this.player.off('learnerStateChanged', this._onStateChange);
    this.player.off('editableChanged', this._onStateChange);
  },

  render: function() {
    var playerStateMutators = _.pick(this, [
      'setStateAndAttributes',
      'setStateAndLearnerState',
      'attributesSetterFor',
      'learnerStateSetterFor'
    ]);

    var { playerStateReady, ...playerState } = this.state;

    if (playerStateReady) {
      var appComponent = this.props.children;
      // Render the app component with player state set as props. State setters
      // are also included.
      return React.addons.cloneWithProps(
        appComponent,
        _.extend({}, playerState, playerStateMutators)
      );
    } else {
      return null;
    }
  },

  // API

  attributesSetterFor: function(key) {
    return this._getSetterFor('attributes', key);
  },

  learnerStateSetterFor: function(key) {
    return this._getSetterFor('learnerState', key);
  },

  setStateAndAttributes: function(attributes) {
    this.setState(attributes);
    this.player.setAttributes(attributes);
  },

  setStateAndLearnerState: function(learnerState) {
    this.setState(learnerState);
    this.player.setLearnerState(learnerState);
  },

  // Private(ish)

  _onStateChange: function(data) {
    if (!_.isEmpty(data)) {
      this.setState(data);
    }
  },

  // Wait for an event to fire once, or give up and callback with an error
  _waitForEvent: function(eventName, callback) {
    // Don't wait forever
    setTimeout(function() {
      this.player.removeListener(eventName, callback);
      var error = new Error(`Timed out waiting for ${eventName}`);
      callback({ error });
    }.bind(this), 5000);

    // Wait for first callback and send the results
    this.player.once(eventName, function(result) {
      callback({ result });
    });
  },

  // Wait for all the data to be ready and update the flag
  _waitForStateReadiness: function() {
    runAsync.parallel([
      this._waitForEvent.bind(this, 'attributesChanged'),
      this._waitForEvent.bind(this, 'learnerStateChanged'),
      this._waitForEvent.bind(this, 'editableChanged')
    ], function(attributes, learnerState, editable) {
      var initialData = [attributes, learnerState, editable];
      var error = _.find(initialData, function(data) {
        return !!data.error;
      });

      if (error) {
        this.setState({ playerStateReady: false });
      } else {
        this.setState({ playerStateReady: true });
      }
    }.bind(this));
  },

  _getSetterFor: function(dataType, keyName) {
    return function(val) {
      var data = {};
      data[keyName] = val;

      if (dataType === 'learnerState') {
        this.setStateAndLearnerState(data);
      } else {
        this.setStateAndAttributes(data);
      }
    }.bind(this);
  }
});

module.exports = PlayerAdapter;
