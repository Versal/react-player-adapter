'use strict';

var React = require('react/addons');
var VersalPlayerAPI = require('versal-gadget-api/src/player-api');

var PlayerAPIMixin = {
  getDefaultProps: function() {
    return {
      debug: false
    };
  },

  propTypes: {
    debug: React.PropTypes.bool,
  },

  componentWillMount: function() {
    this.player = new VersalPlayerAPI({
      debug: this.props.debug
    });
  }
};

module.exports = PlayerAPIMixin;
