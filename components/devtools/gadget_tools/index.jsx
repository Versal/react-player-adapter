'use strict';

var _ = require('underscore');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var humanize = require("underscore.string/humanize");

var GadgetTools = React.createClass({
  getDefaultProps: function() {
    return {
      editable: {}
    };
  },

  render: function() {
    var editingIndicator = this.props.editable.editable ? 'authoring' : 'learning';
    var className = "gadget-tools side-panel side-panel-left";

    var maybeComponent = null;

    if (this.props.showGadgetTools) {
      maybeComponent = (
        <div key="gadget-tools" className={className}>
          <div className="gadget-tool-editing">
            <button onClick={this.props.onToggleEdit}>toggle</button>
            <span>{editingIndicator}</span>
          </div>
          <div className="gadget-tool-property-sheets">
            {_.map(this.props.propertySheets, this._renderPropertySheet)}
          </div>
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup transitionName="slide-panel-in-from-left">
        {maybeComponent}
      </ReactCSSTransitionGroup>
    );
  },

  _renderPropertySheet: function(config, name) {
    var options = config.options.map(function(value, key) {
      var optionProps = { value, key };
      return (
        <option {...optionProps}>{value}</option>
      );
    });

    var selectProps = {
      ref: name,
      value: this.props.attributes[name],
      onChange: _.partial(this._onChange, name)
    };

    var selectWidget = (
      <select {...selectProps}>
        {options}
      </select>
    );

    return (
      <div key={name}>
        <div>{humanize(name)}</div>
        <div>{selectWidget}</div>
      </div>
    );
  },

  _onChange: function(name) {
    var attributes = {};
    attributes[name] = this.refs[name].getDOMNode().value;
    this.props.setAttributes(attributes);
  }
});

module.exports = GadgetTools;
