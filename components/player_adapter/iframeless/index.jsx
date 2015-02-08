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

var GadgetTools = React.createClass({
  render: function() {
    var editingIndicator = this.props.editable ? 'authoring' : 'learning';
    var className = "gadget-gadget-tools side-panel side-panel-left";

    var maybeComponent = null;

    if (this.props.showGadgetTools) {
      maybeComponent = (
        <div key="gadget-tools" className={className}>
          <div className="gadget-gadget-tool-editing">
            <button onClick={this.props.onToggleEdit}>toggle</button>
            <span>{editingIndicator}</span>
          </div>
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup transitionName="slide-panel-in-from-left">
        {maybeComponent}
      </ReactCSSTransitionGroup>
    );
  }
});

var GadgetInfo = React.createClass({
  render: function() {
    var className = "gadget-info side-panel side-panel-right";

    var maybeComponent = null;

    if (this.props.showGadgetTools) {
      maybeComponent = (
        <div key="info" className={className}>
          <div>
            {this.props.manifest.title} v{this.props.manifest.version}
          </div>
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup transitionName="slide-panel-in-from-right">
        {maybeComponent}
      </ReactCSSTransitionGroup>
    );
  }
});

var DebugTools = React.createClass({
  mixins: [LocalStorageMixin],

  getInitialState: function() {
    return {
      showGadgetTools: false
    };
  },

  componentWillMount: function() {
    this.iframelessPlayerApi =
      new IframelessPlayerAPI(this.props.manifest);

    Keypress.bind('v z', this._onToggleGadgetTools);
    Keypress.bind('v e', this._onToggleEdit);

    this.iframelessPlayerApi.on('editableChanged', this._onEditableChanged);
  },

  componentWillUnmount: function() {
    this.iframelessPlayerApi.off('editableChanged', this._onEditableChanged);

    Keypress.unbind('v z', this._onToggleGadgetTools);
    Keypress.unbind('v e', this._onToggleEdit);
  },

  render: function() {
    return (
      <div>
        <GadgetTools
          {...this.props}
          {...this.state}
          onToggleEdit={this._onToggleEdit} />

        <CropMarks>
          <PlayerAdapter {...this.props} playerApi={this.iframelessPlayerApi}>
            {this.props.children}
          </PlayerAdapter>
        </CropMarks>

        <GadgetInfo
          {...this.props}
          {...this.state} />
      </div>
    );
  },

  _onToggleGadgetTools: function() {
    this.setState({
      showGadgetTools: !this.state.showGadgetTools
    });
  },

  _onEditableChanged: function(editable) {
    this.setState(editable);
  },

  _onToggleEdit: function() {
    var event = new Event('toggleEdit');
    document.body.dispatchEvent(event);
  }
});

module.exports = DebugTools;
