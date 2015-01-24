'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var renderComponent = TestUtils.renderIntoDocument;

var PlayerAPIMixin = require('../../mixins/player_api');

var PlayerStateComponent = React.createClass({
  mixins: [
    PlayerAPIMixin,
  ],
  render: function() {
    return null;
  }
});

describe('PlayerAPIMixin', function() {
  it('should create a versal API instance', function() {
    var playerStateComponent = renderComponent(
      <PlayerStateComponent>
        <div>test component</div>
      </PlayerStateComponent>
    );

    expect(playerStateComponent.player).to.exist;
  });
});
