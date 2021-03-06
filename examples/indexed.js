
import 'rmc-list-view/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import ListView from 'rmc-list-view';

const NUM_SECTIONS = 20;
const NUM_ROWS_PER_SECTION = 10;

const Demo = React.createClass({
  getInitialState() {
    const getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    const getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[rowID];
    };

    const dataSource = new ListView.DataSource({
      getRowData: getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    const dataBlob = {};
    const sectionIDs = [];
    const rowIDs = [];
    for (let ii = 0; ii < NUM_SECTIONS; ii++) {
      const sectionName = `Section ${ii}`;
      sectionIDs.push(sectionName);
      dataBlob[sectionName] = sectionName;
      rowIDs[ii] = [];

      for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
        const rowName = `S${ii}, R${jj}`;
        rowIDs[ii].push(rowName);
        dataBlob[rowName] = rowName;
      }
    }
    return {
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
      headerPressCount: 0,
    };
  },

  renderRow(rowData) {
    return (<div style={{ padding: 10 }}>Hello: {rowData}</div>);
  },

  renderSectionHeader(sectionData) {
    return (
      <div style={{ color: 'blue', padding: 10, backgroundColor: '#ddd' }}>
        {sectionData}
      </div>
    );
  },

  render() {
    return (<div>
      <ListView.IndexedList
        dataSource={this.state.dataSource}
        renderHeader={() => <span style={{ padding: 10 }}>header</span>}
        renderFooter={() => <span style={{ padding: 10 }}>footer</span>}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        stickyHeader
        stickyProps={{
          stickyStyle: { zIndex: 999 },
          topOffset: -83,
          // isActive: false,
        }}
        quickSearchBarStyle={{
          top: 20,
        }}
      />
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
