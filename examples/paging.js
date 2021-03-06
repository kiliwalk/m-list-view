// use jsx to render html, do not modify simple.html

import 'rmc-list-view/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import ListView from 'rmc-list-view';
import { View, Text, pagingStyles as styles, TouchableOpacity, Thumb } from './util';

const NUM_SECTIONS = 20;
const NUM_ROWS_PER_SECTION = 10;
let pageIndex = 0;

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

    this.dataBlob = {};
    this.sectionIDs = [];
    this.rowIDs = [];
    this._genData = (pIndex = 0) => {
      for (let i = 0; i < NUM_SECTIONS; i++) {
        let ii = pIndex * NUM_SECTIONS + i;
        const sectionName = `Section ${ii}`;
        this.sectionIDs.push(sectionName);
        this.dataBlob[sectionName] = sectionName;
        this.rowIDs[ii] = [];

        for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
          const rowName = `S${ii}, R${jj}`;
          this.rowIDs[ii].push(rowName);
          this.dataBlob[rowName] = rowName;
        }
      }
      // new object ref
      this.sectionIDs = [].concat(this.sectionIDs);
      this.rowIDs = [].concat(this.rowIDs);
    }
    this._genData();
    return {
      dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
      headerPressCount: 0,
    };
  },

  renderRow(rowData: string) {
    return (<Thumb text={rowData} />);
  },

  renderSectionHeader(sectionData: string) {
    return (
      <View style={styles.section}>
        <Text style={styles.text}>
          {sectionData}
        </Text>
      </View>
    );
  },

  renderHeader() {
    let headerLikeText = this.state.headerPressCount % 2 ?
      <View><Text style={styles.text}>1 Like</Text></View> :
      null;
    return (
      <TouchableOpacity onPress={this._onPressHeader} style={styles.header}>
        {headerLikeText}
        <View>
          <Text style={styles.text}>
            Table Header (click me)
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  renderFooter() {
    return (
      <View style={styles.header}>
        <Text onPress={() => console.log('Footer!')} style={styles.text}>
          Table Footer
        </Text>
      </View>
    );
  },
  componentDidMount() {
    console.log(this.refs.lv);
  },
  render() {
    return (<div>
      <ListView ref="lv"
        style={styles.listview}
        dataSource={this.state.dataSource}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        initialListSize={10}
        pageSize={4}
        scrollRenderAheadDistance={500}
        scrollEventThrottle={100}
        onScroll={() => { console.log('scroll'); } }
        onEndReached={this._onEndReached}
        onEndReachedThreshold={500}
        // renderScrollComponent={props => <div className="for-scroll-demo" {...props} />}
        renderBodyComponent={() => <div className="for-body-demo" />}
        stickyHeader
        stickyProps={{
          className: 'for-sticky-demo',
          stickyStyle: { top: '10px' },
          onStickyStateChange: this._onStickyStateChange,
        }}
        stickyContainerProps={{
          className: 'for-stickyContainer-demo',
        }}
      />
    </div>);
  },

  _onStickyStateChange(isSticky) {
    // console.log(isSticky);
  },

  _onPressHeader() {
    this.setState({ headerPressCount: this.state.headerPressCount + 1 });
  },

  _onEndReached(event) {
    // load new data
    console.log('reach end', event);
    this._genData(++pageIndex);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
    });
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
