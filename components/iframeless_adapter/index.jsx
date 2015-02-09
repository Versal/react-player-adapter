'use strict';

/* global document */
/* global Event */
/* global localStorage */
/* global window */

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
      this.setState.bind(this)
    );

    this.iframelessPlayerApi.on(
      'attributesChanged',
      this.setState.bind(this)
    );
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
          onClearState={this._onClearState} />
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

  _onClearState: function() {
    localStorage.clear();
    window.location.reload();
  }
});

module.exports = IframelessAdapter;
