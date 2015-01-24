'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var renderComponent = TestUtils.renderIntoDocument;

var PlayerAPIMixin = require('../../mixins/player_api');
var PlayerStateReadyMixin = require('../../mixins/player_state_ready');

var PlayerStateComponent = React.createClass({
  mixins: [
    // NOTE: State mixin depends on API mixin
    PlayerAPIMixin,
    PlayerStateReadyMixin
  ],
  render: function() {
    return null;
  }
});

describe('PlayerStateReadyMixin', function() {
  it('should export a falsey value', function() {
    var playerStateComponent = renderComponent(
      <PlayerStateComponent>
        <div>test component</div>
      </PlayerStateComponent>
    );

    expect(playerStateComponent.state.playerStateReady).to.be.false;
  });

  describe('when all data has arrived', function() {
    it('should export a truthey value', function(done) {
      var playerStateComponent = renderComponent(
        <PlayerStateComponent>
          <div>test component</div>
        </PlayerStateComponent>
      );

      playerStateComponent.player.emit('attributesChanged', { bar: 3 });
      playerStateComponent.player.emit('learnerStateChanged', { foo: 2 });
      playerStateComponent.player.emit('editableChanged', { editable: true });

      setTimeout(function() {
        expect(playerStateComponent.state.playerStateReady).to.be.true;
        done();
      }, 1);
    });
  });
});
