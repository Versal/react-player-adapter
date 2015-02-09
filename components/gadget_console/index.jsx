'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var GadgetConsole = React.createClass({
  render: function() {
    var className = "gadget-console bottom-panel";

    var maybeComponent = null;

    if (this.props.showGadgetConsole) {
      maybeComponent = (
        <div key="gadget-console" className={className}>
          <div>
            <div>
              <button onClick={this.props.onClearState}>
                Clear state
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup transitionName="slide-panel-in-from-bottom">
        {maybeComponent}
      </ReactCSSTransitionGroup>
    );
  }
});

module.exports = GadgetConsole;
