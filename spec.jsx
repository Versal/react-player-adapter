'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var renderComponent = TestUtils.renderIntoDocument;
var findComponent = TestUtils.findRenderedDOMComponentWithClass;

var PlayerAdapter = require('./index');
var VersalPlayerAPI = require('versal-gadget-api/src/player-api');

var testManifest = {
  name: 'fake-gadget',
  title: 'Fake gadget',
  version: '0.0.1',
  description: 'Does fake things',
  author: 'Faker',
};

describe('Player', function() {
  describe('Init', function() {
    it('should create a versal API instance', function() {
      var playerApi = new VersalPlayerAPI();
      var playerAdapterComponent = renderComponent(
        <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
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
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
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
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
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
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
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
        <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
          <div>test component</div>
        </PlayerAdapter>
      );

      expect(playerAdapterComponent.state.playerStateReady).to.be.false;
    });

    describe('when all data has arrived', function() {
      it('should export a truthey value', function(done) {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
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
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
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
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
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
    describe('setStateAndPlayerAttributes', function() {
      it('should set attributes on the adapter component', function() {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
            <div>test component</div>
          </PlayerAdapter>
        );

        playerAdapterComponent.setStateAndPlayerAttributes({
          foo: 'moof'
        });
        expect(playerAdapterComponent.state.foo).to.eq('moof');
      });

      it('should callback when state as set a la `setState`', function(done) {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
            <div>test component</div>
          </PlayerAdapter>
        );

        playerAdapterComponent.setStateAndPlayerAttributes({
          foo: 'doof'
        }, done);
      });

      it('should send attributes to the player', function() {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
            <div>test component</div>
          </PlayerAdapter>
        );

        sinon.stub(playerApi, 'setAttributes');

        playerAdapterComponent.setStateAndPlayerAttributes({
          foo: 'feef'
        });

        playerApi.setAttributes.called.should.be.true;
        var persistedAttributes = playerApi.setAttributes.firstCall.args[0];
        persistedAttributes.foo.should.eq('feef');

        playerApi.setAttributes.restore();
      });
    });

    describe('setStateAndPlayerLearnerState', function() {
      it('should set learner state on the adapter component', function() {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
            <div>test component</div>
          </PlayerAdapter>
        );

        playerAdapterComponent.setStateAndPlayerLearnerState({
          foo: 'leef'
        });
        expect(playerAdapterComponent.state.foo).to.eq('leef');
      });

      it('should callback when state as set a la `setState`', function(done) {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
            <div>test component</div>
          </PlayerAdapter>
        );

        playerAdapterComponent.setStateAndPlayerLearnerState({
          foo: 'heef'
        }, done);
      });

      it('should send learner state to the player', function() {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
            <div>test component</div>
          </PlayerAdapter>
        );

        sinon.stub(playerApi, 'setLearnerState');

        playerAdapterComponent.setStateAndPlayerLearnerState({
          foo: 'weef'
        });

        playerApi.setLearnerState.called.should.be.true;
        var persistedLearnerState = playerApi.setLearnerState.firstCall.args[0];
        persistedLearnerState.foo.should.eq('weef');

        playerApi.setLearnerState.restore();
      });
    });

    describe('attributesSetterForKey', function() {
      it('should return a setter for a specific key', function(done) {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
            <div>test component</div>
          </PlayerAdapter>
        );

        var setter = playerAdapterComponent.attributesSetterForKey('doof');
        sinon.stub(playerAdapterComponent, 'setStateAndPlayerAttributes');

        setter('loof');

        // Wait for debouncing to finish
        setTimeout(function() {
          var persistedAttributes = playerAdapterComponent
                                    .setStateAndPlayerAttributes
                                    .firstCall
                                    .args[0];
          persistedAttributes.doof.should.eq('loof');

          playerAdapterComponent.setStateAndPlayerAttributes.restore();
          done();
        }, playerAdapterComponent.props.debounceSaveMs);
      });
    });

    describe('learnerStateSetterForKey', function() {
      it('should return a setter for a specific key', function(done) {
        var playerApi = new VersalPlayerAPI();
        var playerAdapterComponent = renderComponent(
          <PlayerAdapter playerApi={playerApi} manifest={testManifest}>
            <div>test component</div>
          </PlayerAdapter>
        );

        var setter = playerAdapterComponent.learnerStateSetterForKey('doof');
        sinon.stub(playerAdapterComponent, 'setStateAndPlayerLearnerState');

        setter('loof');

        // Wait for debouncing to finish
        setTimeout(function() {
          var persistedLearnerState = playerAdapterComponent
                                    .setStateAndPlayerLearnerState
                                    .firstCall
                                    .args[0];
          persistedLearnerState.doof.should.eq('loof');

          playerAdapterComponent.setStateAndPlayerLearnerState.restore();
          done();
        }, playerAdapterComponent.props.debounceSaveMs);
      });
    });
  });
});
