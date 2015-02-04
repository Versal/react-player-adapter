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
    el.style.maxWidth = '720px';
    el.style.margin = '20px auto';
  }
}

module.exports = IframelessPlayerAPI;
