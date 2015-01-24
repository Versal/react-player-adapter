'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var findComponent = TestUtils.findRenderedDOMComponentWithClass;
var renderComponent = TestUtils.renderIntoDocument;

var PlayerAPIMixin = require('../../mixins/player_api');
var PlayerStateMixin = require('../../mixins/player_state');
var PlayerStateReadyMixin = require('../../mixins/player_state_ready');
var PlayerStateRendererMixin = require('../../mixins/player_state_renderer');

var PlayerStateComponent = React.createClass({
  mixins: [
    // NOTE: Renderer depends on it's sibling mixins
    PlayerAPIMixin,
    PlayerStateMixin,
    PlayerStateReadyMixin,
    PlayerStateRendererMixin
  ],
  render: function() {
    return this.renderAppComponentWithPlayerState({
      additionalPropFoo: 'bar'
    });
  }
});

describe('PlayerStateRendererMixin', function() {
  it('should render nothing', function() {
    var playerStateComponent = renderComponent(
      <div className="wrapper">
        <PlayerStateComponent>
          <div className="test">test component</div>
        </PlayerStateComponent>
      </div>
    );

    var wrapperComponent = findComponent(playerStateComponent, 'wrapper');
    var componentText = wrapperComponent.getDOMNode().textContent;
    expect(componentText).to.not.contain('test component');
  });

  describe('when data is ready', function() {
    it('should render the child component with `this state` set as props', function(done) {

      var playerStateComponent = renderComponent(
        <PlayerStateComponent>
          <div className="test">test component</div>
        </PlayerStateComponent>
      );

      playerStateComponent.player.emit('attributesChanged', { bar: 3 });
      playerStateComponent.player.emit('learnerStateChanged', { foo: 2 });
      playerStateComponent.player.emit('editableChanged', { editable: true });

      setTimeout(function() {
        var componentText = playerStateComponent.getDOMNode().textContent;
        expect(componentText).to.contain('test component');
        done();
      }, 100);
    });
  });

  describe('when additional props are supplied', function() {
    it('should render the child component with the additional values set as props', function(done) {
      var TestComponent = React.createClass({
        render: function() {
          return (
            <div>
              add prop foo: {this.props.additionalPropFoo}
            </div>
          );
        }
      });
      var playerStateComponent = renderComponent(
        <PlayerStateComponent>
          <TestComponent />
        </PlayerStateComponent>
      );

      playerStateComponent.player.emit('attributesChanged', { bar: 3 });
      playerStateComponent.player.emit('learnerStateChanged', { foo: 2 });
      playerStateComponent.player.emit('editableChanged', { editable: true });

      setTimeout(function() {
        var componentText = playerStateComponent.getDOMNode().textContent;
        expect(componentText).to.contain('add prop foo: bar');
        done();
      }, 100);
    });
  });
});
