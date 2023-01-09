import React, { PureComponent, Fragment } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import PropTypes from "prop-types";

const SortableItem = SortableElement(({ value }) => {
  return <div>{value}</div>;
});

const SortableList = SortableContainer(({ children }) => {
  return <div>{children}</div>;
});

export default class Sortable extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    onSortEndAction: PropTypes.func.isRequired,
    element: PropTypes.func.isRequired,
  };

  createItems = () => {
    const { element, items } = this.props;
    let renderedItems = [];
    items.map((value, idx) => {
      renderedItems.push(
        <SortableItem
          key={`item-${idx}`}
          index={idx}
          collection={"zzzz"}
          value={element(idx)}
        />
      );
    });

    return renderedItems;
  };

  render() {
    const { onSortEndAction } = this.props;
    return (
      <Fragment>
        <SortableList
          onSortEnd={onSortEndAction}
          useDragHandle
          axis="y"
          lockAxis="y"
        >
          {this.createItems()}
        </SortableList>
      </Fragment>
    );
  }
}
