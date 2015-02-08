'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var GadgetInfo = React.createClass({
  render: function() {
    var className = "gadget-info side-panel side-panel-right";

    var maybeComponent = null;

    if (this.props.showGadgetTools) {
      maybeComponent = (
        <div key="gadget-info" className={className}>
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

module.exports = GadgetInfo;
