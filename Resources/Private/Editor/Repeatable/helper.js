import positionalArraySorter from "@neos-project/positional-array-sorter";
import { nanoid } from "nanoid";

export function set(path, value, object) {
    path = getPath(path);
    return recursivelySetValueInObject(object, value, path);
}

export function removeKeyPropertyFromObject(array, KEY_PROPERTY) {
    return clone(array).map((item) => {
        delete item[KEY_PROPERTY];
        return item;
    });
}

export const clone = (input) => JSON.parse(JSON.stringify(input));

export const isSame = (a, b) => JSON.stringify(a) == JSON.stringify(b);

export function isNumeric(str) {
    if (typeof str == "number") {
        return true;
    }
    if (typeof str != "string") {
        return false;
    }
    // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this) and ensure strings of whitespace fail
    return !isNaN(str) && !isNaN(parseFloat(str));
}

export function ClientEvalIsNotFinished(input) {
    if (!input) {
        return false;
    }
    if (typeof input == "string") {
        return input.includes("ClientEval:");
    }

    if (Array.isArray(input)) {
        return input.some((value) => ClientEvalIsNotFinished(value));
    }
    if (isObject(input)) {
        return ClientEvalIsNotFinished(Object.values(input));
    }
    return false;
}

export function ItemEvalRecursive(input, item, node, parentNode, documentNode) {
    if (typeof input === "string") {
        return ItemEval(input, item, node, parentNode, documentNode);
    }

    if (Array.isArray(input)) {
        return input.map((value) => ItemEvalRecursive(value, item, node, parentNode, documentNode));
    }

    if (isObject(input)) {
        return Object.fromEntries(
            Object.entries(input).map(([key, value]) => [
                key,
                ItemEvalRecursive(value, item, node, parentNode, documentNode),
            ]),
        );
    }

    return input;
}

function ItemEval(propertyValue, item, node, parentNode, documentNode) {
    if (typeof propertyValue === "string" && propertyValue.startsWith("ItemEval:")) {
        try {
            // eslint-disable-next-line no-new-func
            const evaluateFn = new Function(
                "item,node,parentNode,documentNode",
                "return " + propertyValue.replace("ItemEval:", ""),
            );
            return evaluateFn(item, node, parentNode, documentNode);
        } catch (e) {
            console.warn('An error occurred while trying to evaluate "' + propertyValue + '"\n', e);
            return propertyValue; // Return the original value if evaluation fails
        }
    }
    return propertyValue;
}

function isObject(input) {
    return input != null && (input.constructor === Object || (!input.constructor && typeof input === "object"));
}

export function dynamicSort(arrayToSort, sortBy) {
    const array = clone(arrayToSort);
    if (!Array.isArray(array) || !array.length || !Array.isArray(sortBy) || !sortBy.length) {
        return array;
    }
    return array.sort((a, b) => {
        return sortBy.reduce((result, current) => {
            if (result !== 0) {
                return result;
            }

            const { property, order = "asc" } = current;
            const propA = a[property];
            const propB = b[property];

            let comparison = 0;

            if (isNumeric(propA) && isNumeric(propB)) {
                if (propA > propB) {
                    comparison = 1;
                } else if (propA < propB) {
                    comparison = -1;
                }
            } else {
                comparison = propA.localeCompare(propB);
            }

            if (order === "desc") {
                comparison *= -1;
            }

            return comparison;
        }, 0);
    });
}

export function deepMerge(obj1, obj2) {
    const copy = clone(obj1);
    for (let key in obj2) {
        if (key in obj2) {
            if (obj2[key] instanceof Object && copy[key] instanceof Object) {
                copy[key] = deepMerge(copy[key], obj2[key]);
            } else {
                copy[key] = obj2[key];
            }
        }
    }
    return copy;
}

function getPath(path) {
    if (Array.isArray(path)) {
        return path;
    }

    if (typeof path === "number") {
        return [path];
    }

    return path.split(".").map((part) => {
        const partAsInteger = parseInt(part);

        if (!isNaN(partAsInteger) && String(partAsInteger) === part) {
            return partAsInteger;
        }

        return part;
    });
}

function recursivelySetValueInObject(object, value, path) {
    if (path.length === 0) {
        return value;
    }

    //
    // Create missing path targets
    //
    if (typeof object === "undefined") {
        if (typeof path[0] === "number") {
            object = [];
        } else {
            object = {};
        }
    }

    if (Array.isArray(object)) {
        //
        // Make sure that array elements are always inserted at the last position, if the path exceeds the length
        // of the array
        //
        if (typeof path[0] === "number" && object.length < path[0]) {
            path[0] = object.length;
        }

        const result = [...object];
        result[path[0]] = recursivelySetValueInObject(object[path[0]], value, path.slice(1));

        return result;
    }

    return Object.assign({}, object, { [path[0]]: recursivelySetValueInObject(object[path[0]], value, path.slice(1)) });
}

export function getInitialValue({ emptyGroup, value, KEY_PROPERTY, options }) {
    // add a fixed index to the value
    let result = addKeyToValue(value, KEY_PROPERTY);
    const { min, max } = options;

    if (min) {
        if (result.length < min) {
            for (var i = 0; i < min; ++i) {
                if (result[i]) {
                    result[i] = value[i];
                } else {
                    result[i] = emptyGroup;
                }
            }
        }
    }
    if (max && result.length > max) {
        result = result.slice(0, max);
    }

    if (result.length) {
        for (let key = 0; key < result.length; key++) {
            const predefined = options?.predefinedProperties?.[key]?.properties;
            const currentEntry = clone(result[key]);
            const availableKeys = Object.keys(currentEntry).filter((key) => key == KEY_PROPERTY || key in emptyGroup);
            const cleanedUpEntry = availableKeys.reduce((cur, keyname) => {
                const isPredefined = predefined?.[keyname]?.defaultValue != undefined;
                let value = isPredefined ? predefined[keyname].defaultValue : currentEntry[keyname];
                if (isNumeric(value)) {
                    value = parseFloat(value);
                }

                return {
                    ...cur,
                    [keyname]: value,
                };
            }, {});
            result[key] = cleanedUpEntry;
        }
    }
    return result;
}

export function getEmptyGroup(properties) {
    if (!properties) {
        return {};
    }
    const group = {};
    // Create array to enable sorting
    const array = [];
    for (const key in properties) {
        const item = properties[key];
        array.push({ key, position: item?.position ?? null, item });
    }
    positionalArraySorter(array).forEach(({ key, item }) => {
        const defaultValue = item && item.defaultValue;
        group[key] = returnValueIfSet(defaultValue, "");
    });
    return group;
}

export function addKeyToValue(value, KEY_PROPERTY) {
    if (!Array.isArray(value)) {
        return [];
    }
    let newValue = clone(value);
    // add an fixed index to the value
    newValue = newValue.map((item) => {
        if (item[KEY_PROPERTY]) {
            return item;
        }
        return {
            ...item,
            [KEY_PROPERTY]: nanoid(),
        };
    });
    return newValue;
}

export function checkIfValueIsSet(value) {
    return !!(value !== null && value !== undefined);
}

export function returnValueIfSet(value, fallback = "") {
    return checkIfValueIsSet(value) ? value : fallback;
}
