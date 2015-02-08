'use strict';

/* global document */
/* global localStorage */

// Provides a stand-in for `VersalPlayerAPI` for use with `PlayerAdapter`.

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var emptyPlayerState = {
  learnerState: {},
  attributes: {},
  editable: false
};

class IframelessPlayerAPI extends EventEmitter {
  constructor(config) {
    // Fix legacy naming
    var defaultAttributes = config.defaultConfig || {};

    // We're grabbing the latest state from localstorage which is saved by
    // a react mixin.
    // TODO Needs to be clearable
    var key = `PlayerAdapter-${config.name}`;
    var savedState = {};
    if (localStorage[key]) {
      try {
        savedState = JSON.parse(localStorage[key]);
      } catch (error) {
        console.error(error);
      }
    }

    // Make sure we have sensible defaults if nothing's been saved
    this.playerState = _.defaults(savedState, emptyPlayerState);

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
      this.emit('editableChanged', { editable: this.playerState.editable });
    }.bind(this));
  }

  setAttributes(attributes) {
    _.defer(function() {
      attributes = _.extend({}, this.playerState.attributes, attributes);
      this.playerState.attributes = attributes;
      this.emit('attributesChanged', attributes);
    }.bind(this));
  }

  setLearnerState(learnerState) {
    _.defer(function() {
      learnerState = _.extend({}, this.playerState.learnerState, learnerState);
      this.playerState.learnerState = learnerState;
      this.emit('learnerStateChanged', learnerState);
    }.bind(this));
  }

  setPropertySheetAttributes(settings) {}
  watchBodyHeight() {}

  // Iframeless launcher specific API

  _listenForPlayerEvents() {
    document.body.addEventListener('toggleEdit', function() {
      this.playerState.editable = !this.playerState.editable;
      this.emit('editableChanged', { editable: this.playerState.editable });
    }.bind(this));
  }

  _injectGlobalStyles() {
    // Gadget theme locks this down but in the context of an iframeless
    // launcher it makes more sense to allow scrolling
    document.documentElement.style.overflow = 'scroll';
  }
}

module.exports = IframelessPlayerAPI;
