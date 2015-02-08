'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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

module.exports = GadgetTools;
