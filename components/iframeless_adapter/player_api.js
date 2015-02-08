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
    _.defer(function() {
      this.emit('attributesChanged', this.playerState.attributes);
      this.emit('learnerStateChanged', this.playerState.learnerState);
      this.emit('editableChanged', this.playerState.editable);
    }.bind(this));
  }

  setAttributes(attributes) {
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

  setPropertySheetAttributes(settings) {}
  watchBodyHeight() {}

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
    this.emit(`${name}Changed`, value);
    localStorage[this.localStorageKey] = JSON.stringify(this.playerState);
  }

  _injectGlobalStyles() {
    // Gadget theme locks this down but in the context of an iframeless
    // launcher it makes more sense to allow scrolling
    document.documentElement.style.overflow = 'scroll';
  }
}

module.exports = IframelessPlayerAPI;
