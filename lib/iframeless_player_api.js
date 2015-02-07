'use strict';

/* global document */

// Provides a stand-in for using a `PlayerAdapter`.

var playerState = {
  learnerState: {},
  attributes: {},
  editable: false
};

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

class IframelessPlayerAPI extends EventEmitter {
  constructor(defaultConfig) {
    if (defaultConfig) {
      playerState.attributes = defaultConfig;
    }
    this._injectGlobalStyles();
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

  _injectGlobalStyles() {
    var el = document.querySelector('body > div');
    // The width-ish of the player iframe
    el.style.maxWidth = '720px';
    // Keep it in the centered up, also player-ish
    el.style.margin = '0 auto';
    // Be more like a <body>
    el.style.position = 'relative';
    // Gadget theme locks this down but in the context of an iframeless
    // launcher it makes more sense to allow scrolling
    document.documentElement.style.overflow = 'scroll';
  }
}

module.exports = IframelessPlayerAPI;
