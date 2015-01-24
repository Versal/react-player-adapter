'use strict';

var _ = require('underscore');

// Essentially this mixin keeps all player state flowing into the app's root
// component. Sets the values in `attributes`, `learnerState`, and `editable`
// as state on the mixed-upon component using `this.setState`.

var PlayerStateMixin = {
  componentWillMount: function() {
    this.player.on('attributesChanged', this._onStateChange);
    this.player.on('learnerStateChanged', this._onStateChange);
    this.player.on('editableChanged', this._onStateChange);
  },

  componentWillUnmount: function() {
    this.player.off('attributesChanged', this._onStateChange);
    this.player.off('learnerStateChanged', this._onStateChange);
    this.player.off('editableChanged', this._onStateChange);
  },

  _onStateChange: function(data) {
    if (!_.isEmpty(data)) {
      this.setState(data);
    }
  }
};

module.exports = PlayerStateMixin;
