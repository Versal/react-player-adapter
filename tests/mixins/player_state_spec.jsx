'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var renderComponent = TestUtils.renderIntoDocument;

var PlayerAPIMixin = require('../../mixins/player_api');
var PlayerStateMixin = require('../../mixins/player_state');

var PlayerStateComponent = React.createClass({
  mixins: [
    // NOTE: State mixin depends on API mixin
    PlayerAPIMixin,
    PlayerStateMixin
  ],
  render: function() {
    return null;
  }
});

describe('PlayerStateMixin', function() {

  describe('attributes', function() {
    it('should sync to `this.state`', function() {
      var playerStateComponent = renderComponent(
        <PlayerStateComponent>
          <div>test component</div>
        </PlayerStateComponent>
      );

      expect(playerStateComponent.state).to.be.null;
      playerStateComponent.player.emit('attributesChanged', { foo: 1 });
      expect(playerStateComponent.state.foo).to.equal(1);
    });
  });

  describe('learnerState', function() {
    it('should sync to `this.state`', function() {
      var playerStateComponent = renderComponent(
        <PlayerStateComponent>
          <div>test component</div>
        </PlayerStateComponent>
      );

      expect(playerStateComponent.state).to.be.null;
      playerStateComponent.player.emit('learnerStateChanged', { baz: 2 });
      expect(playerStateComponent.state.baz).to.equal(2);
    });
  });

  describe('editable', function() {
    it('should sync to `this.state`', function() {
      var playerStateComponent = renderComponent(
        <PlayerStateComponent>
          <div>test component</div>
        </PlayerStateComponent>
      );

      expect(playerStateComponent.state).to.be.null;
      playerStateComponent.player.emit('editableChanged', { editable: true });
      expect(playerStateComponent.state.editable).to.be.true;
      playerStateComponent.player.emit('editableChanged', { editable: false });
      expect(playerStateComponent.state.editable).to.be.false;
    });
  });
});
