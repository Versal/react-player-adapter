'use strict';

var React = require('react/addons');

require('./index.styl');

var CropMarks = React.createClass({
  render: function() {
    return (
      <table className="crop-marks" border="0"
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
              {this.props.children}
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

module.exports = CropMarks;
