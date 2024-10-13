export function set(path, value, object) {
    path = getPath(path);
    return recursivelySetValueInObject(object, value, path);
}

export function deepMerge(obj1, obj2) {
    const copy = { ...obj1 };
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
        // Make sure, that array elements are always inserted at the last position, if the path exceeds the length
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
