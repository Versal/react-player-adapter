'use strict';

/* global document */
/* global localStorage */

// Provides a stand-in for `VersalPlayerAPI` for use with `PlayerAdapter`.

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var emptyPlayerState = {
  learnerState: {},
  attributes: {},
  editable: { editable: false }
};

var log = function() {
  console.info.apply(console, arguments);
};

var logOutgoing = _.partial(log, '↗', _, '↗');
var logIncoming = _.partial(log, '↙', _, '↙');

class IframelessPlayerAPI extends EventEmitter {
  constructor(config) {
    // Fix legacy naming and provide default to the default
    var defaultAttributes = config.defaultConfig || {};

    this.localStorageKey = `IframelessPlayerAPI-${config.name}`;

    var savedState = {};
    if (localStorage[this.localStorageKey]) {
      try {
        savedState = JSON.parse(localStorage[this.localStorageKey]);
      } catch (error) {
        console.error(error);
      }
    }

    // Make sure we have sensible defaults if nothing's been saved
    this.playerState = _.defaults(
      savedState,
      emptyPlayerState
    );

    // Make sure defaults from the config are applied
    if (defaultAttributes) {
      this.playerState.attributes = _.defaults(
        this.playerState.attributes,
        defaultAttributes
      );
    }

    this._injectGlobalStyles();
    this._listenForPlayerEvents();
  }

  startListening() {
    logIncoming('startListening');
    _.defer(function() {
      this._sendMessageToGadget('attributesChanged', this.playerState.attributes);
      this._sendMessageToGadget('learnerStateChanged', this.playerState.learnerState);
      this._sendMessageToGadget('editableChanged', this.playerState.editable);
    }.bind(this));
  }

  _sendMessageToGadget(messageName, payload) {
    logOutgoing(messageName, payload);
    this.emit(messageName, payload);
  }

  setAttributes(attributes) {
    logIncoming('startAttributes');
    _.defer(function() {
      attributes = _.extend(
        {},
        this.playerState.attributes,
        attributes
      );

      this._setPlayerState(
        'attributes',
        attributes
      );
    }.bind(this));
  }

  setLearnerState(learnerState) {
    logIncoming('setLearnerState');
    _.defer(function() {
      learnerState = _.extend(
        {},
        this.playerState.learnerState,
        learnerState
      );

      this._setPlayerState(
        'learnerState',
        learnerState
      );
    }.bind(this));
  }

  setPropertySheetAttributes(settings) {
    logIncoming('setPropertySheetAttributes');
  }

  watchBodyHeight() {
    logIncoming('watchBodyHeight');
  }

  // Iframeless launcher specific API

  _listenForPlayerEvents() {
    document.body.addEventListener('toggleEdit', function() {
      this._setPlayerState(
        'editable',
        { editable: !this.playerState.editable.editable }
      );
    }.bind(this));
  }

  _setPlayerState(name, value) {
    this.playerState[name] = value;
    this._sendMessageToGadget(`${name}Changed`, value);
    localStorage[this.localStorageKey] = JSON.stringify(this.playerState);
  }

  _injectGlobalStyles() {
    // Gadget theme locks this down but in the context of an iframeless
    // launcher it makes more sense to allow scrolling
    document.documentElement.style.overflow = 'scroll';
  }
}

module.exports = IframelessPlayerAPI;
