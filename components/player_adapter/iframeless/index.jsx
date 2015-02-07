'use strict';

var React = require('react/addons');
var PlayerAdapter = require('../index');

var IframelessPlayerAPI = require('./player_api');

require('./index.styl');

var DebugTools = React.createClass({
  componentWillMount: function() {
    this.iframelessPlayerApi =
      new IframelessPlayerAPI(this.props.defaultAttributes);
  },

  // A silly grid that is styled to look like crop marks around the gadget
  render: function() {
    return (
      <table className="grid" border="0"
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
              <PlayerAdapter {...this.props} playerApi={this.iframelessPlayerApi}>
                {this.props.children}
              </PlayerAdapter>
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

module.exports = DebugTools;
