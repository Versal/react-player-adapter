'use strict';

/* global document */
/* global Event */

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var PlayerAdapter = require('../index');
var LocalStorageMixin = require('react-localstorage');
var IframelessPlayerAPI = require('./player_api');
var CropMarks = require('../../crop_marks');
var Keypress = require('mousetrap');

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

    Keypress.bind('v z', this._onToggleControls);
    Keypress.bind('v e', this._onToggleEdit);
  },

  componentWillUnmount: function() {
    Keypress.unbind('v z', this._onToggleControls);
    Keypress.unbind('v e', this._onToggleEdit);
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

  _onToggleControls: function() {
    this.setState({
      showControls: !this.state.showControls
    });
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
});

module.exports = DebugTools;
