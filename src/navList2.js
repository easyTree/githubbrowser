import React from 'react';
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized';
import NavListItem from './navListItem';


const NavList2 = ({
  remoteRowCount,
  list,
  isRowLoaded,
  loadMoreRows,
  batchSize,
  threshold,
  activeId,
  loaderRef
}) => {
  function rowRenderer({
    index,       // Index of row
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    key,         // Unique key within array of rendered rows
    parent,      // Reference to the parent List (instance)
    style        // Style object to be applied to row (to position it);
    // This must be passed through to the rendered row element.
  }) {
    const repo = list[index]

    return (
      <div
        key={key}
        style={style}
      >
      <NavListItem index={index} repo={repo} active={repo && activeId === repo.id} />
      </div>
    )
  }

  return (
    <div className='sidebar-list' {...this.props}>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={remoteRowCount}
        minimumBatchSize={batchSize}
        threshold={threshold}
        ref={loaderRef}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer className='lee-auto-sizer'>
            {({ height, width }) => (
              <List
                height={height}
                rowCount={remoteRowCount}
                rowHeight={41}
                rowRenderer={rowRenderer}
                width={width}

                className='sidebar-list'
                estimatedRowSize={41}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  );
};

export default NavList2;
