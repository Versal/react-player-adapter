'use strict';

var _ = require('underscore');
var React = require('react/addons');

// A component that can show `React.addons.Perf.printWasted` output
// inline. There's some gross stuff in here but it works.

var ReactDefaultPerfAnalysis = require(
  'react/lib/ReactDefaultPerfAnalysis'
);

var ReactDefaultPerf = require(
  'react/lib/ReactDefaultPerf'
);

var WastedRenderResults = React.createClass({
  getInitialState: function() {
    return {
      summary: []
    };
  },

  renderRow: function(columnNames, row) {
    var columns = columnNames.map(function(name) {
      return (
        <td>{row[name]}</td>
      );
    });

    return (
      <tr>{columns}</tr>
    );
  },

  renderHeaderColumn: function(name) {
    return (
      <th>{name}</th>
    );
  },

  render: function() {
    var measurements = ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerf.getMeasurementsSummaryMap(measurements);

    var totalTime = ReactDefaultPerfAnalysis
      .getTotalTime(measurements)
      .toFixed(2) + ' ms';

    if (_.isEmpty(summary)) {
      return <div className="wasted-render-empty">No results</div>;
    } else {
      var columnNames = _.keys(_.first(summary));
      var rowRenderer = _.partial(this.renderRow, columnNames);
      var rows = summary.map(rowRenderer);
      var headerColumns = columnNames.map(this.renderHeaderColumn);

      return (
        <table className="wasted-render-results">
          <thead>
            <tr>
              {headerColumns}
            </tr>
          </thead>
          <tbody>
            {rows}
            <tr className="wasted-render-footer">
              <td colSpan="3">{totalTime} seconds elapsed</td>
            </tr>
          </tbody>
        </table>
      );
    }
  }
});

module.exports = WastedRenderResults;
