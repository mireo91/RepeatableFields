import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";
import { selectors } from "@neos-project/neos-ui-redux-store";
import { neos } from "@neos-project/neos-ui-decorators";
import { IconButton, Button, Label } from "@neos-project/react-ui-components";
import backend from "@neos-project/neos-ui-backend-connector";
import Loading from "carbon-neos-loadinganimation/LoadingWithStyles";
import { Sortable, DragHandle } from "./Sortable";
import Envelope from "./Envelope";
import Preview from "./Preview";
import {
    addKeyToValue,
    checkIfValueIsSet,
    ClientEvalIsNotFinished,
    clone,
    deepMerge,
    dynamicSort,
    getEmptyGroup,
    getInitialValue,
    isNumeric,
    isSame,
    ItemEvalRecursive,
    removeKeyPropertyFromObject,
    returnValueIfSet,
    set,
} from "./helper";
import style from "./style.module.css";

const KEY_PROPERTY = "_UUID_";

const getDataLoaderOptionsForProps = (props) => ({
    contextNodePath: props.focusedNodePath,
    dataSourceIdentifier: props.options?.dataSourceIdentifier,
    dataSourceUri: props.options?.dataSourceUri,
    dataSourceAdditionalData: props.options?.dataSourceAdditionalData,
    dataSourceDisableCaching: Boolean(props.options?.dataSourceDisableCaching),
});

function Repeatable({
    commit,
    dataSourcesDataLoader,
    editorRegistry,
    i18nRegistry,
    id,
    validatorRegistry,
    value,
    renderHelpIcon,
    identifier,
    ...props
}) {
    const { dataSourceIdentifier, dataSourceUri, dataSourceAdditionalData } = props.options;
    const hasDataSource = !!(dataSourceIdentifier || dataSourceUri);

    const label = i18nRegistry.translate(props.label);
    const [isLoading, setLoading] = useState(true);
    const [dataTypes, setDataTypes] = useState({});
    const [allowAdd, setAllowAdd] = useState(true);
    const [allowRemove, setAllowRemove] = useState(true);
    const [currentValue, setCurrentValue] = useState([]);
    const [options, setOptions] = useState(hasDataSource ? null : props.options);
    const [emptyGroup, setEmptyGroup] = useState({});
    const [collapsed, setCollapsed] = useState({});

    // We use this hack to prevent the editor from re-rendering all the time, even if the options are the same.
    const returnCurrentValueAsJSON = () => JSON.stringify(currentValue);
    const [currentValueAsJSON, setCurrentValueAsJSON] = useState("[]");

    useEffect(() => {
        setLoading(true);
        backend
            .get()
            .endpoints.dataSource("get-property-types", null, {})
            .then((json) => {
                setDataTypes(json);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const dataAsJSON = returnCurrentValueAsJSON();
        if (currentValueAsJSON === dataAsJSON || !options) {
            return;
        }
        setCurrentValueAsJSON(dataAsJSON);
        testIfAdd(currentValue);
        testIfRemove(currentValue);
        if (options?.sortBy) {
            const timeout = setTimeout(() => {
                const sorted = dynamicSort(currentValue, options?.sortBy);
                handleValueChange(sorted);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [currentValue]);

    const updateCurrentValue = (value) => {
        const commitValue = removeKeyPropertyFromObject(currentValue, KEY_PROPERTY);
        if (isSame(value, commitValue)) {
            return;
        }
        setCurrentValue(addKeyToValue(value, KEY_PROPERTY));
    };

    const debouncedValueChange = useDebouncedCallback((value) => {
        updateCurrentValue(value);
    }, 1000);

    useEffect(() => {
        if (options?.sortBy) {
            debouncedValueChange(value);
            return;
        }
        updateCurrentValue(value);
    }, [value]);

    useEffect(() => {
        if (!options || ClientEvalIsNotFinished(options)) {
            return;
        }
        const emptyGroup = getEmptyGroup(options?.properties);
        const newValue = getInitialValue({ emptyGroup, value, KEY_PROPERTY, options });
        setEmptyGroup(emptyGroup);
        setCurrentValue(newValue);
    }, [options, dataTypes]);

    // We use this hack to prevent the editor from re-rendering all the time, even if the options are the same.
    const returnDataSourceOptionsAsJSON = () =>
        JSON.stringify({ dataSourceIdentifier, dataSourceUri, dataSourceAdditionalData });
    const [dataSourceOptionsAsJSON, setDataSourceOptionsAsJSON] = useState(null);
    useEffect(() => {
        if (!hasDataSource) {
            return;
        }
        const dataAsJSON = returnDataSourceOptionsAsJSON();
        if (dataSourceOptionsAsJSON === dataAsJSON) {
            return;
        }
        setLoading(true);
        setDataSourceOptionsAsJSON(dataAsJSON);

        dataSourcesDataLoader.resolveValue(getDataLoaderOptionsForProps(props), currentValue).then((values) => {
            setOptions(deepMerge(props.options, values));
            setLoading(false);
        });
    }, [dataSourceIdentifier, dataSourceUri, dataSourceAdditionalData]);

    function handleValueChange(inputValue) {
        // Nothing changed, do nothing
        if (isSame(inputValue, currentValue)) {
            return;
        }

        // Remove the KEY_PROPERTY from the inputValue
        const commitValue = removeKeyPropertyFromObject(inputValue, KEY_PROPERTY);

        // If the value is the same as the commitValue, don't commit
        if (!isSame(commitValue, value)) {
            commit(commitValue);
        }
        setCurrentValue(inputValue);
    }

    function testIfAdd(value) {
        if (options?.max) {
            setAllowAdd(options.max > value.length);
        }
    }

    function testIfRemove(value) {
        if (options?.min) {
            setAllowRemove(options.min < value.length);
        }
    }

    function handleAdd() {
        setCollapsed({
            ...collapsed,
            [currentValue.length]: false,
        });
        handleValueChange([...currentValue, emptyGroup]);
    }

    function handleRemove(idx) {
        const value = currentValue.filter((s, sidx) => idx !== sidx);
        handleValueChange(value);
    }

    function handleCollapse(idx, currentValue) {
        setCollapsed({
            ...collapsed,
            [idx]: !currentValue,
        });
    }

    function commitChange(idx, property, event) {
        handleValueChange(set(property, event, currentValue));
    }

    function validateElement({ value, propertyDefinition, idx }) {
        const validators = propertyDefinition?.validation;
        if (!validators) {
            return;
        }
        const validationResultsArray = Object.keys(validators)
            .map((validatorName) => {
                const validatorConfiguration = validators[validatorName];
                const validator = validatorRegistry.get(validatorName);
                if (validator) {
                    return validator(value, validatorConfiguration);
                }
                console.warn(`Validator ${validatorName} not found`);
            })
            .filter((result) => result);
        if (options?.controls?.add) {
            const allowed = options?.max ? options.max > currentValue.length : true;
            setAllowAdd(allowed && validationResultsArray.length <= 0);
        }
        return validationResultsArray;
    }

    function createElement(idx) {
        const isPredefined = options?.predefinedProperties?.[idx];
        const { controls, sortBy, properties, allowRemovePredefinedProperties } = options;

        const hasRemove = controls.remove && allowRemove ? !isPredefined || allowRemovePredefinedProperties : false;

        const hasMove = !isPredefined && controls.move && currentValue.length > 1;
        const hasTwoButtons = hasRemove && hasMove;
        const hasOneButton = hasRemove || hasMove;
        const propertiesCount = Object.keys(properties).length;
        if (propertiesCount === 1) {
            return (
                <div
                    className={clsx(
                        style.simpleWrapper,
                        hasTwoButtons ? style.simpleWrapperTwoButtons : hasOneButton && style.simpleWrapperOneButton,
                    )}
                >
                    {getProperties(idx)}
                    {hasOneButton && (
                        <div class={style.simpleButtons}>
                            {hasRemove && (
                                <IconButton onClick={() => handleRemove(idx)} className={style.delete} icon="trash" />
                            )}
                            {hasMove && <DragHandle />}
                        </div>
                    )}
                </div>
            );
        }

        const hasCollapse = !!controls.collapse;
        const isCollapsed = hasCollapse
            ? typeof collapsed[idx] === "boolean"
                ? collapsed[idx]
                : !!options?.collapsed
            : false;

        return (
            <div className={style.wrapper}>
                {Boolean(hasOneButton || hasCollapse) && (
                    <div class={style.buttons}>
                        {getPreview(idx)}
                        {hasMove && <DragHandle />}
                        {hasCollapse && (
                            <IconButton
                                onClick={() => handleCollapse(idx, isCollapsed)}
                                icon={isCollapsed ? "chevron-down" : "chevron-up"}
                            />
                        )}
                        {hasRemove && (
                            <IconButton onClick={() => handleRemove(idx)} className={style.delete} icon="trash" />
                        )}
                    </div>
                )}
                {!isCollapsed && getProperties(idx)}
            </div>
        );
    }

    function getProperties(idx) {
        const { predefinedProperties } = options;
        const groupLabel = predefinedProperties && predefinedProperties[idx] ? predefinedProperties[idx].label : null;
        let properties = [];
        Object.keys(emptyGroup).map((property) => {
            properties.push(getProperty(property, idx));
        });
        properties = properties.filter(Boolean);

        if (properties.length === 0) {
            return null;
        }

        return (
            <div className={style.group}>
                {groupLabel && <span dangerouslySetInnerHTML={{ __html: groupLabel }} />}
                {properties}
            </div>
        );
    }

    function getPreview(idx) {
        let text = options?.preview?.text;
        let image = options?.preview?.image;
        let backgroundColor = options?.preview?.backgroundColor;

        if (!text && !image && !backgroundColor) {
            return null;
        }
        if (text) {
            text = ItemEvalRecursive(text, currentValue[idx], props.node, props.parentNode, props.documentNode);
        }
        if (image) {
            image = ItemEvalRecursive(image, currentValue[idx], props.node, props.parentNode, props.documentNode);
        }
        if (backgroundColor) {
            backgroundColor = ItemEvalRecursive(
                backgroundColor,
                currentValue[idx],
                props.node,
                props.parentNode,
                props.documentNode,
            );
        }
        return <Preview text={i18nRegistry.translate(text)} image={image} backgroundColor={backgroundColor} />;
    }

    function getProperty(property, idx) {
        const repeatableValue = clone(currentValue);
        const { properties, predefinedProperties } = options;
        let propertyDefinition = ItemEvalRecursive(
            properties[property],
            repeatableValue[idx],
            props.node,
            props.parentNode,
            props.documentNode,
        );
        if (
            predefinedProperties &&
            predefinedProperties[idx] &&
            predefinedProperties[idx].properties &&
            predefinedProperties[idx].properties[property]
        ) {
            propertyDefinition = deepMerge(propertyDefinition, predefinedProperties[idx]["properties"][property]);
        }

        const defaultDataType = propertyDefinition.type ? dataTypes[propertyDefinition.type] : {};
        if (defaultDataType) {
            propertyDefinition = deepMerge(defaultDataType, propertyDefinition);
        }

        let editorOptions = returnValueIfSet(propertyDefinition.editorOptions, {});
        const editor = returnValueIfSet(propertyDefinition.editor, "Neos.Neos/Inspector/Editors/TextFieldEditor");
        let value = returnValueIfSet(repeatableValue[idx][property]);

        if (!value && checkIfValueIsSet(propertyDefinition.defaultValue)) {
            value = propertyDefinition.defaultValue;
        }

        if (editorOptions.hasOwnProperty("dataSourceUri") || editorOptions.hasOwnProperty("dataSourceIdentifier")) {
            editorOptions = { ...editorOptions };
            if (!editorOptions?.dataSourceAdditionalData) {
                editorOptions.dataSourceAdditionalData = {};
            } else {
                if (editorOptions.dataSourceAdditionalData.hasOwnProperty("repeatableIndex")) {
                    editorOptions.dataSourceAdditionalData["repeatableIndex"] = idx;
                }
                if (editorOptions.dataSourceAdditionalData.hasOwnProperty("repeatableValue")) {
                    editorOptions.dataSourceAdditionalData["repeatableValue"] = currentValue;
                }
            }
        }
        const isSimpleView = Object.keys(properties).length <= 1;

        return (
            <div className={!isSimpleView && style.property} hidden={propertyDefinition.hidden}>
                <Envelope
                    identifier={`${identifier}-repeatable-${idx}-${property}`}
                    options={editorOptions}
                    value={value}
                    renderSecondaryInspector={props.renderSecondaryInspector}
                    editor={editor}
                    editorRegistry={editorRegistry}
                    i18nRegistry={i18nRegistry}
                    validationErrors={validateElement({ value, propertyDefinition, idx })}
                    highlight={false}
                    property={`${idx}.${property}`}
                    id={`repeatable-${idx}-${property}`}
                    editorId={id}
                    commit={commitChange}
                    {...propertyDefinition}
                />
            </div>
        );
    }

    if (isLoading || !options) {
        return (
            <>
                {Boolean(label) && (
                    <Label htmlFor={id}>
                        {label} {renderHelpIcon()}
                    </Label>
                )}
                <Loading id={id} isLoading={isLoading} heightMultiplier={2} />
            </>
        );
    }

    if (options.hidden) {
        return null;
    }

    const { buttonAddLabel = "Mireo.RepeatableFields:Main:addRow" } = options;

    return (
        <>
            {Boolean(label) && (
                <Label htmlFor={id}>
                    {label} {renderHelpIcon()}
                </Label>
            )}
            <Sortable
                element={createElement}
                items={currentValue}
                onChange={handleValueChange}
                enable={options?.controls?.move}
                automaticSorting={options?.sortBy}
                value={currentValue}
                KEY_PROPERTY={KEY_PROPERTY}
            />
            {options?.controls?.add && allowAdd && (
                <>
                    <Button onClick={handleAdd} id={id}>
                        {i18nRegistry.translate(buttonAddLabel)}
                    </Button>
                    {Boolean(label) || renderHelpIcon()}
                </>
            )}
        </>
    );
}
Repeatable.propTypes = {
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    // options: PropTypes.object,
    value: PropTypes.arrayOf(PropTypes.object),
    renderSecondaryInspector: PropTypes.func,
    editor: PropTypes.string.isRequired,
    editorRegistry: PropTypes.object.isRequired,
    i18nRegistry: PropTypes.object.isRequired,
    validationErrors: PropTypes.array,
    onEnterKey: PropTypes.func,
    helpMessage: PropTypes.string,
    helpThumbnail: PropTypes.string,
    highlight: PropTypes.bool,

    commit: PropTypes.func.isRequired,
    options: PropTypes.shape({
        hidden: PropTypes.bool,
        buttonAddLabel: PropTypes.string,
        dataSourceIdentifier: PropTypes.string,
        dataSourceUri: PropTypes.string,
        dataSourceDisableCaching: PropTypes.bool,
        dataSourceAdditionalData: PropTypes.objectOf(PropTypes.any),
        predefinedProperties: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.object,
            }),
        ),
        max: PropTypes.number,
        min: PropTypes.number,
        collapsed: PropTypes.bool,
        label: PropTypes.shape({
            label: PropTypes.string,
            image: PropTypes.string,
        }),
        controls: PropTypes.shape({
            move: PropTypes.bool,
            remove: PropTypes.bool,
            add: PropTypes.bool,
            collapse: PropTypes.bool,
        }),
        sortBy: PropTypes.arrayOf(
            PropTypes.shape({
                property: PropTypes.string,
                direction: PropTypes.oneOf(["asc", "desc"]),
            }),
        ),
        //
        // 	properties: PropTypes.objectOf(
        // 		PropTypes.object()
        // 	),
        //
        // 	placeholder: PropTypes.integersOnly,
        // 	// disabled: PropTypes.bool,
        // 	//
        // 	// multiple: PropTypes.bool,
        //
        // 	dataSourceIdentifier: PropTypes.string,
        // 	dataSourceUri: PropTypes.string,
        // 	dataSourceDisableCaching: PropTypes.bool,
        // 	dataSourceAdditionalData: PropTypes.objectOf(PropTypes.any),
        //
        // 	// minimumResultsForSearch: PropTypes.number,
        //
        // properties: PropTypes.objectOf(
        // 	PropTypes.shape({
        // 		label: PropTypes.string,
        // 		icon: PropTypes.string,
        // 		preview: PropTypes.string,
        //
        // 		// TODO
        // 		group: PropTypes.string
        // 	})
        // )
        //
    }).isRequired,
    dataSourcesDataLoader: PropTypes.shape({
        resolveValue: PropTypes.func.isRequired,
    }).isRequired,
    focusedNodePath: PropTypes.string.isRequired,
};

const neosifier = neos((globalRegistry) => ({
    editorRegistry: globalRegistry.get("inspector").get("editors"),
    i18nRegistry: globalRegistry.get("i18n"),
    dataSourcesDataLoader: globalRegistry.get("dataLoaders").get("DataSources"),
}));
const connector = connect((state) => ({
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector(state),
    node: selectors.CR.Nodes.focusedSelector(state),
    parentNode: selectors.CR.Nodes.focusedParentSelector(state),
    documentNode: selectors.CR.Nodes.documentNodeSelector(state),
}));
export default neosifier(connector(Repeatable));
