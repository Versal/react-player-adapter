'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var renderComponent = TestUtils.renderIntoDocument;
var findComponent = TestUtils.findRenderedDOMComponentWithClass;

var PlayerAdapter = require('.');
var VersalPlayerAPI = require('versal-gadget-api/src/player-api');

describe('Player', function() {
  describe('Init', function() {
    it('should create a versal API instance', function() {
      var playerApi = new VersalPlayerAPI();
      var playerAdapterComponent = renderComponent(
        <PlayerAdapter playerApi={playerApi}>
          <div>test component</div>
        </PlayerAdapter>
      );

      expect(playerAdapterComponent.player).to.exist;
    });
  });

  describe('State', function() {
    describe('attributes', function() {
      it('should sync to `this.state`', function() {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi}>
            <div>test component</div>
          </PlayerAdapter>
        );

        expect(playerAdapterComponent.state.foo).to.be.undefined;
        playerAdapterComponent.player.emit('attributesChanged', { foo: 1 });
        expect(playerAdapterComponent.state.foo).to.equal(1);
      });
    });

    describe('learnerState', function() {
      it('should sync to `this.state`', function() {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi}>
            <div>test component</div>
          </PlayerAdapter>
        );

        expect(playerAdapterComponent.state.baz).to.be.undefined;
        playerAdapterComponent.player.emit('learnerStateChanged', { baz: 2 });
        expect(playerAdapterComponent.state.baz).to.equal(2);
      });
    });

    describe('editable', function() {
      it('should sync to `this.state`', function() {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi}>
            <div>test component</div>
          </PlayerAdapter>
        );

        expect(playerAdapterComponent.state.editable).to.be.undefined;
        playerAdapterComponent.player.emit('editableChanged', { editable: true });
        expect(playerAdapterComponent.state.editable).to.be.true;
        playerAdapterComponent.player.emit('editableChanged', { editable: false });
        expect(playerAdapterComponent.state.editable).to.be.false;
      });
    });
  });

  describe('Readiness', function() {
    it('should export a falsey value', function() {
      var playerApi = new VersalPlayerAPI();
      var playerAdapterComponent = renderComponent(
        <PlayerAdapter playerApi={playerApi}>
          <div>test component</div>
        </PlayerAdapter>
      );

      expect(playerAdapterComponent.state.playerStateReady).to.be.false;
    });

    describe('when all data has arrived', function() {
      it('should export a truthey value', function(done) {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi}>
            <div>test component</div>
          </PlayerAdapter>
        );

        playerAdapterComponent.player.emit('attributesChanged', { bar: 3 });
        playerAdapterComponent.player.emit('learnerStateChanged', { foo: 2 });
        playerAdapterComponent.player.emit('editableChanged', { editable: true });

        setTimeout(function() {
          expect(playerAdapterComponent.state.playerStateReady).to.be.true;
          done();
        }, 1);
      });
    });
  });

  describe('Render', function() {
    it('should render nothing', function() {
      var playerApi = new VersalPlayerAPI();
      var playerAdapterComponent = renderComponent(
        <div className="wrapper">
          <PlayerAdapter playerApi={playerApi}>
            <div className="test">test component</div>
          </PlayerAdapter>
        </div>
      );

      var wrapperComponent = findComponent(playerAdapterComponent, 'wrapper');
      var componentText = wrapperComponent.getDOMNode().textContent;
      expect(componentText).to.not.contain('test component');
    });

    describe('when data is ready', function() {
      it('should render the child component with `this state` set as props', function(done) {

        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi}>
            <div className="test">test component</div>
          </PlayerAdapter>
        );

        playerAdapterComponent.player.emit('attributesChanged', { bar: 3 });
        playerAdapterComponent.player.emit('learnerStateChanged', { foo: 2 });
        playerAdapterComponent.player.emit('editableChanged', { editable: true });

        setTimeout(function() {
          var componentText = playerAdapterComponent.getDOMNode().textContent;
          expect(componentText).to.contain('test component');
          done();
        }, 100);
      });
    });
  });

  describe('Mutators', function() {
    it.skip('TODO setStateAndAttributes');
    it.skip('TODO setStateAndLearnerState');
    it.skip('TODO learnerStateSetterFor');
    it.skip('TODO attributesSetterFor');
  });
});
