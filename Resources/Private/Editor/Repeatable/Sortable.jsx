import React from "react";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import PropTypes from "prop-types";

const SortableItem = SortableElement(({ value }) => {
    return <div>{value}</div>;
});

const SortableList = SortableContainer(({ children }) => {
    return <div>{children}</div>;
});

export default function Sortable(props) {
    const { onSortEndAction, element, items } = props;

    // TODO Need we here Fragment ?
    return (
        <SortableList onSortEnd={onSortEndAction} useDragHandle axis="y" lockAxis="y">
            {items.map((value, idx) => (
                <SortableItem key={`item-${idx}`} index={idx} collection={"zzzz"} value={element(idx)} />
            ))}
        </SortableList>
    );
}

Sortable.propTypes = {
    items: PropTypes.array.isRequired,
    onSortEndAction: PropTypes.func.isRequired,
    element: PropTypes.func.isRequired,
};
