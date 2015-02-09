'use strict';

/* global document */
/* global Event */
/* global localStorage */

var _ = require('underscore');
var React = require('react/addons');

var PlayerAdapter = require('../player_adapter/index');
var LocalStorageMixin = require('react-localstorage');
var IframelessPlayerAPI = require('./player_api');
var CropMarks = require('../crop_marks');
var GadgetTools = require('../gadget_tools');
var GadgetInfo = require('../gadget_info');
var GadgetConsole = require('../gadget_console');

var Keypress = require('mousetrap');

require('./index.styl');

var IframelessAdapter = React.createClass({
  mixins: [LocalStorageMixin],

  getInitialState: function() {
    return {
      attributes: {},
      showGadgetTools: false,
      showGadgetConsole: false
    };
  },

  componentWillMount: function() {
    this.iframelessPlayerApi =
      new IframelessPlayerAPI(this.props.manifest);

    Keypress.bind('v z', this._onToggleGadgetTools);
    Keypress.bind('v c', this._onToggleGadgetConsole);
    Keypress.bind('v e', this._onToggleEdit);

    this.iframelessPlayerApi.on(
      'editableChanged',
      _.partial(this.setPlayerState, 'editable')
    );

    this.iframelessPlayerApi.on(
      'attributesChanged',
      _.partial(this.setPlayerState, 'attributes')
    );
  },

  setPlayerState: function(type, data) {
    var state = {};
    state[type] = data;
    this.setState(state);
  },

  componentWillUnmount: function() {
    this.iframelessPlayerApi.removeAllListeners();

    Keypress.unbind('v z', this._onToggleGadgetTools);
    Keypress.unbind('v c', this._onToggleGadgetConsole);
    Keypress.unbind('v e', this._onToggleEdit);
  },

  render: function() {
    var setAttributes =
      this.iframelessPlayerApi
          .setAttributes
          .bind(this.iframelessPlayerApi);

    return (
      <div>
        <GadgetTools
          {...this.props}
          {...this.state}
          setAttributes={setAttributes}
          onToggleEdit={this._onToggleEdit} />

        <CropMarks>
          <PlayerAdapter
            {...this.props}
            playerApi={this.iframelessPlayerApi}>
              {this.props.children}
          </PlayerAdapter>
        </CropMarks>

        <GadgetInfo
          {...this.props}
          {...this.state} />

        <GadgetConsole
          {...this.props}
          {...this.state}
          onClearState={this._onClearState}
          onRestoreState={this._onRestoreState} />
      </div>
    );
  },

  _onToggleGadgetTools: function() {
    this.setState({
      showGadgetTools: !this.state.showGadgetTools
    });
  },

  _onToggleGadgetConsole: function() {
    this.setState({
      showGadgetConsole: !this.state.showGadgetConsole
    });
  },

  _onToggleEdit: function() {
    var event = new Event('toggleEdit');
    document.body.dispatchEvent(event);
  },

  _onRestoreState: function(state) {
    var appEl = document.querySelector('.app');
    React.unmountComponentAtNode(appEl);

    var data = JSON.parse(localStorage.IframelessAdapter);
    var newData = _.omit(data, ['attributes', 'editable']);
    localStorage.IframelessAdapter = JSON.stringify(newData);

    localStorage.removeItem(`PlayerAdapter-${this.props.manifest.name}`);
    localStorage.removeItem(`IframelessPlayerAPI-${this.props.manifest.name}`);

    localStorage.setItem(
      `IframelessPlayerAPI-${this.props.manifest.name}`,
      JSON.stringify(state)
    );

    // You can't do this in modern versions of React. Is there a new public
    // API? Or should we use replaceProps somehow?
    React.render(React.addons.cloneWithProps(this._currentElement), appEl);

    this.iframelessPlayerApi.emit('attributesChanged', this.state.attributes);
    this.iframelessPlayerApi.emit('editableChanged', this.state.editable);

  },

  _onClearState: function() {
    var appEl = document.querySelector('.app');
    React.unmountComponentAtNode(appEl);

    var data = JSON.parse(localStorage.IframelessAdapter);
    var newData = _.omit(data, ['attributes', 'editable']);
    localStorage.IframelessAdapter = JSON.stringify(newData);

    localStorage.removeItem(`PlayerAdapter-${this.props.manifest.name}`);
    localStorage.removeItem(`IframelessPlayerAPI-${this.props.manifest.name}`);

    // You can't do this in modern versions of React. Is there a new public
    // API? Or should we use replaceProps somehow?
    React.render(React.addons.cloneWithProps(this._currentElement), appEl);

    this.iframelessPlayerApi.emit('attributesChanged', this.state.attributes);
    this.iframelessPlayerApi.emit('editableChanged', this.state.editable);
  }
});

module.exports = IframelessAdapter;
