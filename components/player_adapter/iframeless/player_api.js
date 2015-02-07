'use strict';

/* global document */

// Provides a stand-in for `VersalPlayerAPI` for use with `PlayerAdapter`.

var playerState = {
  learnerState: {},
  attributes: {},
  editable: false
};

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

class IframelessPlayerAPI extends EventEmitter {
  constructor(defaultAttributes) {
    if (defaultAttributes) {
      playerState.attributes = defaultAttributes;
    }
    this._injectGlobalStyles();
    this._listenForPlayerEvents();
  }

  startListening() {
    _.defer(function() {
      this.emit('attributesChanged', playerState.attributes);
      this.emit('learnerStateChanged', playerState.learnerState);
      this.emit('editableChanged', { editable: playerState.editable });
    }.bind(this));
  }

  setAttributes(attributes) {
    _.defer(function() {
      attributes = _.extend({}, playerState.attributes, attributes);
      playerState.attributes = attributes;
      this.emit('attributesChanged', attributes);
    }.bind(this));
  }

  setLearnerState(learnerState) {
    _.defer(function() {
      learnerState = _.extend({}, playerState.learnerState, learnerState);
      playerState.learnerState = learnerState;
      this.emit('learnerStateChanged', learnerState);
    }.bind(this));
  }

  setPropertySheetAttributes(settings) {}
  watchBodyHeight() {}

  // Iframeless launcher specific API

  _listenForPlayerEvents() {
    document.body.addEventListener('toggleEdit', function() {
      playerState.editable = !playerState.editable;
      this.emit('editableChanged', { editable: playerState.editable });
    }.bind(this));
  }

  _injectGlobalStyles() {
    // Gadget theme locks this down but in the context of an iframeless
    // launcher it makes more sense to allow scrolling
    document.documentElement.style.overflow = 'scroll';
  }
}

module.exports = IframelessPlayerAPI;
