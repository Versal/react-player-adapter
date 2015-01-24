'use strict';

var React = require('react/addons');
var _ = require('underscore');

// Exposes a renderer that takes the components state and renders it on
// `this.props.children` which is expected to hold the app's root component.
// It's assumed that you also are using `PlayerStateMixin` and
// `PlayerStateReadyMixin`.
//
// You can also pass in an `additionalProps` object with other desired props
// besides `this.state`.

var PlayerStateRendererMixin = {
  renderAppComponentWithPlayerState: function(additionalProps) {
    var { playerStateReady, ...playerState } = this.state;

    if (playerStateReady) {
      var appComponent = this.props.children;
      // Render the app component with player state set as props. State setters
      // are also included.
      return React.addons.cloneWithProps(
        appComponent,
        _.extend({}, playerState, additionalProps)
      );
    } else {
      return null;
    }
  }
};

module.exports = PlayerStateRendererMixin;
