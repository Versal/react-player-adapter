'use strict';

/* global localStorage */

var _ = require('underscore');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var LocalStorageMixin = require('react-localstorage');

var GadgetConsole = React.createClass({
  mixins: [LocalStorageMixin],

  getInitialState: function() {
    return {
      currentPanel: 'state'
    };
  },

  render: function() {
    var maybeComponent = null;

    if (this.props.showGadgetConsole) {
      var className = "gadget-console bottom-panel";
      var savedStates = JSON.parse(
        localStorage[`IframelessStates-${this.props.manifest.name}`] || '[]'
      );

      var onNavToState = _.partial(this._onNavigation, 'state');
      var onNavToProfiler = _.partial(this._onNavigation, 'profiler');

      var stateNavClassNames = 'console-menu-item';
      if (this.state.currentPanel === 'state') {
        stateNavClassNames += ' console-menu-item-selected';
      }
      var profilerNavClassNames = 'console-menu-item';
      if (this.state.currentPanel === 'profiler') {
        profilerNavClassNames += ' console-menu-item-selected';
      }

      var body = null;
      if (this.state.currentPanel === 'state') {
        body = (
          <div>
            <div>
              <button onClick={this.props.onClearState}>
                clear state
              </button>
              <button onClick={this.onSaveState}>
                save state
              </button>
            </div>
            <br />
            <div className="saved-states">
              {_.map(
                savedStates,
                this._renderSavedState)
              }
            </div>
          </div>
        );
      } else if (this.state.currentPanel === 'profiler') {
        body = (
          <div>
            TODO profiler
          </div>
        );
      }

      maybeComponent = (
        <div key="gadget-console" className={className}>
          <div className="console-menu">
            <a onClick={onNavToState} href="#" className={stateNavClassNames}>
              state
            </a>
            <a onClick={onNavToProfiler} href="#" className={profilerNavClassNames}>
              profiler
            </a>
          </div>
          <div className="console-body">
            {body}
          </div>
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup transitionName="slide-panel-in-from-bottom">
        {maybeComponent}
      </ReactCSSTransitionGroup>
    );
  },

  onSaveState: function() {
    var currentStateKey = `IframelessPlayerAPI-${this.props.manifest.name}`;
    var currentStateJSON = localStorage.getItem(currentStateKey);
    var currentState = JSON.parse(currentStateJSON);

    if (!currentState) {
      return alert('There\'s nothing to save');
    }

    var statesJSON = localStorage.getItem(
      `IframelessStates-${this.props.manifest.name}`
    ) || '[]';

    var states = JSON.parse(statesJSON);

    var name = prompt('Snapshot name?');

    if (!name) {
      return alert('You have to choose a name!');
    }

    states.push({
      name,
      state: currentState,
      stamp: new Date(),
    });

    localStorage.setItem(
      `IframelessStates-${this.props.manifest.name}`,
      JSON.stringify(states)
    );

    this.forceUpdate();
  },

  _renderSavedState: function(savedState, index) {
    var onRestoreClick = _.partial(this.props.onRestoreState, savedState.state);
    var onDeleteClick = _.partial(this._onDeleteState, savedState.name);
    return (
      <div>
        <button onClick={onRestoreClick}>restore</button>
        <button onClick={onDeleteClick}>delete</button>
        {savedState.name}
      </div>
    );
  },

  _onDeleteState: function(name) {
    var confirmed = confirm(`Are you sure you want to delete '${name}'?`);

    if (!confirmed) {
      return;
    }

    var statesJSON = localStorage.getItem(
      `IframelessStates-${this.props.manifest.name}`
    ) || '[]';

    var states = JSON.parse(statesJSON);
    states = _.reject(states, function(state) {
      return state.name == name;
    });

    localStorage.setItem(
      `IframelessStates-${this.props.manifest.name}`,
      JSON.stringify(states)
    );

    this.forceUpdate();
  },

  _onNavigation: function(panelName, e) {
    this.setState({ currentPanel: panelName });
    e.preventDefault();
    e.target.blur();
  }
});

module.exports = GadgetConsole;
