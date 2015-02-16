'use strict';

/* global window */

var _ = require('underscore');
var React = require('react/addons');

var IframelessPlayerAPI = require('./iframeless_player_api');
var CropMarks = require('./components/crop_marks');

var ReactLauncher = React.createClass({

  getInitialState: function() {
    return {
      attributes: {}
    };
  },

  componentWillMount: function() {
    var playerAdapterProps = this.props.children.props;

    this.iframelessPlayerApi =
      new IframelessPlayerAPI(playerAdapterProps.manifest);

    // export global for debugging
    window.iframelessPlayerApi = this.iframelessPlayerApi;

    this.iframelessPlayerApi.on(
      'editableChanged',
      _.partial(this.setPlayerState, 'editable')
    );

    this.iframelessPlayerApi.on(
      'attributesChanged',
      _.partial(this.setPlayerState, 'attributes')
    );
  },

  setPlayerState: function(type, data) {
    var state = {};
    state[type] = data;
    this.setState(state);
  },

  componentWillUnmount: function() {
    this.iframelessPlayerApi.removeAllListeners();
  },

  render: function() {
    var playerAdapter = React.addons.cloneWithProps(
      this.props.children,
      { playerApi: this.iframelessPlayerApi }
    );

    return (
      <CropMarks>
        {playerAdapter}
      </CropMarks>
    );
  }
});

module.exports = ReactLauncher;
