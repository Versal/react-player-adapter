'use strict';

/* global document */
/* global Event */

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var PlayerAdapter = require('../index');

var IframelessPlayerAPI = require('./player_api');

require('./index.styl');

var CropMarks = React.createClass({
  render: function() {
    return (
      <table className="crop-marks" border="0"
            cellPadding="0" cellSpacing="0" width="100%">
        <tbody>
          <tr key="head" className="head">
            <td className="corner top left">
              <div className="crop-mark-shim"></div>
            </td>
            <td>
            </td>
            <td className="corner top right">
              <div className="crop-mark-shim"></div>
            </td>
          </tr>
          <tr key="body" className="body">
            <td key="left">
            </td>
            <td key="middle" className="middle">
              {this.props.children}
            </td>
            <td key="right">
            </td>
          </tr>
          <tr key="foot" className="foot">
            <td className="corner bottom left">
              <div className="crop-mark-shim"></div>
            </td>
            <td>
            </td>
            <td className="corner bottom right">
              <div className="crop-mark-shim"></div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
});

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
        <div key="controls" className="controls">
          <button onClick={this._onToggleEdit}>toggle</button>
          <span><em>{editingIndicator}</em></span>
        </div>
      );
    } else {
      controls = null;
    }

    return (
      <ReactCSSTransitionGroup transitionName="controls">
        {controls}
      </ReactCSSTransitionGroup>
    );
  },

  _maybeRenderInfo: function() {
    var info;

    if (this.state.showControls) {
      info = (
        <div key="info" className="info">
          <div>
            {this.props.manifest.title} v{this.props.manifest.version}
          </div>
        </div>
      );
    } else {
      info = null;
    }

    return (
      <ReactCSSTransitionGroup transitionName="info">
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
