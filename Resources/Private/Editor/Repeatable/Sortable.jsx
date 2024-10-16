import React, { useEffect, useState } from "react";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Icon } from "@neos-project/react-ui-components";
import { arrayMoveImmutable } from "array-move";
import PropTypes from "prop-types";
import style from "./style.module.css";

export const DragHandle = SortableHandle(() => (
    <span type="button" className={style.move}>
        <Icon icon="sort" />
    </span>
));

const animateOptions = { disrespectUserMotionPreferences: true };

const SortableItem = SortableElement(({ value }) => {
    return <div>{value}</div>;
});

const SortableList = SortableContainer(({ children, automaticSorting, manualSort }) => {
    const [animationParent, enable] = useAutoAnimate(animateOptions);

    useEffect(() => {
        document.body.style.cursor = manualSort ? "grabbing" : null;
        enable(false);
        const timeout = setTimeout(() => {
            enable(!manualSort);
        }, 500);
        return () => clearTimeout(timeout);
    }, [manualSort]);

    return (
        <div className={manualSort && style.noSelect} ref={automaticSorting ? animationParent : null}>
            {children}
        </div>
    );
});

export function Sortable({ onChange, value, element, items, enable, automaticSorting, KEY_PROPERTY }) {
    if (!enable) {
        const [animationParent] = useAutoAnimate(animateOptions);

        return (
            <div ref={automaticSorting ? animationParent : null}>
                {items.map((value, idx) => (
                    <div key={value[KEY_PROPERTY]}>{element(idx)}</div>
                ))}
            </div>
        );
    }

    const [manualSort, setManualSort] = useState(false);

    function onSortEnd({ oldIndex, newIndex }) {
        onChange(arrayMoveImmutable(value, oldIndex, newIndex));
        setManualSort(false);
    }

    return (
        <SortableList
            onSortStart={() => setManualSort(true)}
            manualSort={manualSort}
            onSortEnd={onSortEnd}
            automaticSorting={automaticSorting}
            useDragHandle
            axis="y"
            lockAxis="y"
        >
            {items.map((value, idx) => (
                <SortableItem key={value[KEY_PROPERTY]} index={idx} value={element(idx)} />
            ))}
        </SortableList>
    );
}

Sortable.propTypes = {
    items: PropTypes.array.isRequired,
    onSortEndAction: PropTypes.func.isRequired,
    element: PropTypes.func.isRequired,
};
