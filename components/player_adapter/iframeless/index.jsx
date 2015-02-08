'use strict';

/* global document */
/* global Event */

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var PlayerAdapter = require('../index');
var LocalStorageMixin = require('react-localstorage');
var IframelessPlayerAPI = require('./player_api');
var CropMarks = require('../../crop_marks');

require('./index.styl');

var DebugTools = React.createClass({
  mixins: [LocalStorageMixin],

  getInitialState: function() {
    return {
      showControls: false
    };
  },

  componentWillMount: function() {
    this.iframelessPlayerApi =
      new IframelessPlayerAPI(this.props.manifest);

    this.iframelessPlayerApi.on('editableChanged', this._onEditableChanged);
    this._listenForSecretHandshake();
  },

  componentWillUnmount: function() {
    this._stopListeningForSecretHandshake();
  },

  render: function() {
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="slide-panel-in-from-left">
          {this._maybeRenderControls()}
        </ReactCSSTransitionGroup>

        <CropMarks>
          <PlayerAdapter {...this.props} playerApi={this.iframelessPlayerApi}>
            {this.props.children}
          </PlayerAdapter>
        </CropMarks>

        <ReactCSSTransitionGroup transitionName="slide-panel-in-from-right">
          {this._maybeRenderInfo()}
        </ReactCSSTransitionGroup>
      </div>
    );
  },

  _onEditableChanged: function(editable) {
    this.setState(editable);
  },

  _maybeRenderControls: function() {
    var editingIndicator = this.state.editable ? 'authoring' : 'learning';

    if (this.state.showControls) {
      return (
        <div key="controls" className="controls side-panel side-panel-left">
          <button onClick={this._onToggleEdit}>toggle</button>
          <span><em>{editingIndicator}</em></span>
        </div>
      );
    } else {
      return null;
    }
  },

  _maybeRenderInfo: function() {
    if (this.state.showControls) {
      return (
        <div key="info" className="info side-panel side-panel-right">
          <div>
            {this.props.manifest.title} v{this.props.manifest.version}
          </div>
        </div>
      );
    } else {
      return null;
    }
  },

  _onToggleEdit: function() {
    var event = new Event('toggleEdit');
    document.body.dispatchEvent(event);
  },

  _listenForSecretHandshake: function() {
    document.body.addEventListener('keyup', function(e) {
      if (e.which === 18) {
        var now = new Date();
        if (this._lastSecretKeyUp) {
          var elapsed = (now.getTime() - this._lastSecretKeyUp.getTime());
          if (elapsed <= 300) {
            this.setState({
              showControls: !this.state.showControls
            });
          }
        }
        this._lastSecretKeyUp = new Date();
      }
    }.bind(this));
  },

  _stopListeningForSecretHandshake: function() {
    document.body.removeEventListener('keyup');
  }
});

module.exports = DebugTools;
