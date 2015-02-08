'use strict';

/* global document */
/* global Event */

var React = require('react/addons');

var PlayerAdapter = require('../player_adapter/index');
var LocalStorageMixin = require('react-localstorage');
var IframelessPlayerAPI = require('./player_api');
var CropMarks = require('../crop_marks');
var GadgetTools = require('../gadget_tools');
var GadgetInfo = require('../gadget_info');

var Keypress = require('mousetrap');

require('./index.styl');

var IframelessAdapter = React.createClass({
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
    this.iframelessPlayerApi.off(
      'editableChanged',
      this.setState.bind(this)
    );
    this.iframelessPlayerApi.off(
      'attributesChanged',
      this.setState.bind(this)
    );

    Keypress.unbind('v z', this._onToggleGadgetTools);
    Keypress.unbind('v e', this._onToggleEdit);
  },

  render: function() {
    var setAttributes = this
                          .iframelessPlayerApi
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
      </div>
    );
  },

  _onToggleGadgetTools: function() {
    this.setState({
      showGadgetTools: !this.state.showGadgetTools
    });
  },

  _onToggleEdit: function() {
    var event = new Event('toggleEdit');
    document.body.dispatchEvent(event);
  }
});

module.exports = IframelessAdapter;
