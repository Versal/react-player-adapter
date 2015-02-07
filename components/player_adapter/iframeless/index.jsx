'use strict';

/* global document */
/* global Event */

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var PlayerAdapter = require('../index');

var IframelessPlayerAPI = require('./player_api');
var CropMarks = require('../../crop_marks');

require('./index.styl');

var DebugTools = React.createClass({
  getInitialState: function() {
    return {
      showControls: false
    };
  },

  componentWillMount: function() {
    this.iframelessPlayerApi =
      new IframelessPlayerAPI(this.props.manifest.defaultConfig);

    this.iframelessPlayerApi.on('editableChanged', this._onEditableChanged);
    this._listenForSecretHandshake();
  },

  componentWillUnmount: function() {
    this._stopListeningForSecretHandshake();
  },

  // A silly grid that is styled to look like crop marks around the gadget

  render: function() {
    return (
      <div>
        {this._maybeRenderControls()}
        <CropMarks>
          <PlayerAdapter {...this.props} playerApi={this.iframelessPlayerApi}>
            {this.props.children}
          </PlayerAdapter>
        </CropMarks>
        {this._maybeRenderInfo()}
      </div>
    );
  },

  _onEditableChanged: function(editable) {
    this.setState(editable);
  },

  _maybeRenderControls: function() {
    var editingIndicator = this.state.editable ? 'authoring' : 'learning';

    var controls;
    if (this.state.showControls) {
      controls = (
        <div key="controls" className="controls side-panel side-panel-left">
          <button onClick={this._onToggleEdit}>toggle</button>
          <span><em>{editingIndicator}</em></span>
        </div>
      );
    } else {
      controls = null;
    }

    return (
      <ReactCSSTransitionGroup transitionName="slide-panel-in-from-left">
        {controls}
      </ReactCSSTransitionGroup>
    );
  },

  _maybeRenderInfo: function() {
    var info;

    if (this.state.showControls) {
      info = (
        <div key="info" className="info side-panel side-panel-right">
          <div>
            {this.props.manifest.title} v{this.props.manifest.version}
          </div>
        </div>
      );
    } else {
      info = null;
    }

    return (
      <ReactCSSTransitionGroup transitionName="slide-panel-in-from-right">
        {info}
      </ReactCSSTransitionGroup>
    );
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
