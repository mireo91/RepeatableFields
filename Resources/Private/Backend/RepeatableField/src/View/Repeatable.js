import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import Sortable from "./Sortable";
import Envelope from "./Envelope";

import { connect } from "react-redux";
import { selectors } from "@neos-project/neos-ui-redux-store";
import I18n from "@neos-project/neos-ui-i18n";
import { neos } from "@neos-project/neos-ui-decorators";
import { IconButton, Icon, Button } from "@neos-project/react-ui-components";
import { $get, $set, $transform } from "plow-js";

import style from "../style.css";
import { SortableHandle } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import backend from "@neos-project/neos-ui-backend-connector";
import merge from "lodash.merge";

const getDataLoaderOptionsForProps = props => ({
	contextNodePath: props.focusedNodePath,
	dataSourceIdentifier: props.options.dataSourceIdentifier,
	dataSourceUri: props.options.dataSourceUri,
	dataSourceAdditionalData: props.options.dataSourceAdditionalData,
	dataSourceDisableCaching: Boolean(props.options.dataSourceDisableCaching)
});
@neos((globalRegistry) => ({
  editorRegistry: globalRegistry.get("inspector").get("editors"),
  i18nRegistry: globalRegistry.get("i18n"),
  dataSourcesDataLoader: globalRegistry.get("dataLoaders").get("DataSources"),
}))
@connect(
  $transform({
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector,
  })
)
export default class Repeatable extends PureComponent {
  emptyGroup = {};

  state = {
    dataTypes: {},
    allowAdd: true,
    allowRemove: true,
    isLoading: true,
    currentValue: [],
  };

  static propTypes = {
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
      buttonAddLabel: PropTypes.string,
			dataSourceIdentifier: PropTypes.string,
			dataSourceUri: PropTypes.string,
			dataSourceDisableCaching: PropTypes.bool,
			dataSourceAdditionalData: PropTypes.objectOf(PropTypes.any),
			predefinedProperties: PropTypes.arrayOf(PropTypes.shape({
				label: PropTypes.string,
				value: PropTypes.object
			})),
			max: PropTypes.number,
			min: PropTypes.number,
			controls: PropTypes.shape({
				move: PropTypes.bool,
				remove: PropTypes.bool,
				add: PropTypes.bool
			}),
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

  componentDidMount() {
		this.loadRepeatableOptions(() => {
			this.setState({ isLoading: true });
			backend
				.get()
				.endpoints.dataSource("get-property-types", null, {})
				.then((json) => {
					this.initialValue();
					const value = this.getValue();
					this.testIfAdd(value);
					this.testIfRemove(value);
					this.setState({ dataTypes: json, isLoading: false });
				});
		});
  }

  componentDidUpdate(prevProps) {
    // if our data loader options have changed (e.g. due to use of ClientEval), we want to re-initialize the data source.
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
    	this.loadRepeatableOptions(() => {
				this.initialValue();
			});
    }

  }

  loadRepeatableOptions(callback) {
		if (this.props.options.dataSourceIdentifier || this.props.options.dataSourceUri) {
			this.setState({isLoading: true});
			this.props.dataSourcesDataLoader.resolveValue(getDataLoaderOptionsForProps(this.props), this.getValue())
				.then(selectBoxOptions => {
					this.props.options = merge(JSON.parse(JSON.stringify(this.props.options)), selectBoxOptions);
					callback();
					this.setState({isLoading: false});
				});
			return;
		}
		callback();
  }

  constructor(props) {
    super(props);
		this.loadRepeatableOptions(() => {
			const { properties } = props.options;
			if (properties) {
				Object.keys(properties).map((property, index) => {
					this.emptyGroup[property] = properties[property].defaultValue !== undefined
						? properties[property].defaultValue
						: "";
				});
			}
		});
  }

  initialValue = () => {
    const { options, value } = this.props;
    var currentValue = value ? [...value] : [];

    if (options.min) {
      if (currentValue.length < options.min) {
        for (var i = 0; i < options.min; ++i) {
          if (currentValue[i]) {
            currentValue[i] = value[i];
          } else {
            currentValue[i] = this.emptyGroup;
          }
        }
      }
    }
    if (options.max) {
      if (currentValue.length > options.max) {
        currentValue = currentValue.slice(0, options.max);
      }
    }

    if (currentValue.length > 0) {
      for (var key = 0; key < currentValue.length; key++) {
        var test = { ...currentValue[key] };
        test = Object.keys(test)
          .filter((key) => this.emptyGroup.hasOwnProperty(key))
          .reduce((cur, keyname) => {
						var source = { [keyname]: test[keyname] };
						if( options.predefinedProperties && options.predefinedProperties[key]
							&& options.predefinedProperties[key].properties
							&& options.predefinedProperties[key].properties.hasOwnProperty(keyname)
							&& options.predefinedProperties[key].properties[keyname].defaultValue ){
							source[keyname] = options.predefinedProperties[key].properties[keyname].defaultValue;
						}
            return Object.assign(cur, source);
          }, {});
        currentValue[key] = test;
      }
    }
    this.setState({ currentValue: currentValue });
  };

  getValue = () => {
    // this.initialValue();
    const { currentValue } = this.state;
    return currentValue ? currentValue : [];
  };

  handleValueChange = (value) => {
    const { commit, options } = this.props;
    commit(value);
    this.testIfAdd(value);
    this.testIfRemove(value);
    this.setState({ currentValue: value });
  };

  testIfAdd = (value) => {
    const { options } = this.props;
    if (options.max) {
      if (options.max > value.length) {
        this.setState({ allowAdd: true });
      } else {
        this.setState({ allowAdd: false });
      }
    }
  };
  testIfRemove = (value) => {
    const { options } = this.props;
    if (options.min) {
      if (options.min < value.length) {
        this.setState({ allowRemove: true });
      } else {
        this.setState({ allowRemove: false });
      }
    }
  };

  handleAdd = () => {
    let value = this.getValue();
    value = [...value, this.emptyGroup];
    this.handleValueChange(value);
  };

  handleRemove = (idx) => {
    const value = this.getValue().filter((s, sidx) => idx !== sidx);
    this.handleValueChange(value);
  };

  commitChange = (idx, property, event) => {
    this.handleValueChange($set(property, event, this.getValue()));
  };

  validateElement = (elementValue, elementConfiguration, idx, identifier) => {
    if (elementConfiguration && elementConfiguration.validation) {
      const validators = elementConfiguration.validation;
      const validationResults = Object.keys(validators).map((validatorName) => {
        const validatorConfiguration = validators[validatorName];
        return this.checkValidator(
          elementValue,
          validatorName,
          validatorConfiguration
        );
      });
			const validationResultsArray = validationResults.filter((result) => result);
			if( this.props.options.controls.add ) {
				if (validationResultsArray.length > 0) {
					this.setState({ allowAdd: false })
				} else {
					this.setState({ allowAdd: true })
				}
			}
      return validationResultsArray;
    }
  };

  checkValidator = (elementValue, validatorName, validatorConfiguration) => {
    const validator = this.props.validatorRegistry.get(validatorName);
    if (validator) {
      return validator(elementValue, validatorConfiguration);
    }
    console.warn(`Validator ${validatorName} not found`);
  };

  createElement = (idx) => {
    const { options } = this.props;
    const { allowRemove, currentValue } = this.state;
    const isPredefined = options.predefinedProperties && options.predefinedProperties[idx] ? true : false;
    const DragHandle = SortableHandle(() => (
      <span type="button" className={style.move}>
        <Icon icon="sort" />
      </span>
    ));

    const propertiesCount = Object.keys(options.properties).length;
    if (propertiesCount === 1) {
      return (
        <div className={style.simpleWrapper}>
          {this.getProperties(idx)}
          <div class={style.simpleButtons}>
            {!isPredefined && options.controls.remove && allowRemove ? (
              <IconButton
                onClick={() => this.handleRemove(idx)}
                className={style.delete}
                icon="trash"
              />
            ) : (
              ""
            )}
            {!isPredefined && options.controls.move && currentValue.length > 1 ? (
              <DragHandle />
            ) : (
              ""
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className={style.wrapper}>
          <div class={style.buttons}>
            {!isPredefined && options.controls.move && currentValue.length > 1 ? (
              <DragHandle />
            ) : (
              ""
            )}
            {!isPredefined && options.controls.remove && allowRemove ? (
              <IconButton
                onClick={() => this.handleRemove(idx)}
                className={style.delete}
                icon="trash"
              />
            ) : (
              ""
            )}
          </div>
          {this.getProperties(idx)}
        </div>
      );
    }
  };

  getProperties = (idx) => {
		const groupLabel = this.props.options.predefinedProperties && this.props.options.predefinedProperties[idx] ? this.props.options.predefinedProperties[idx].label : null;
    let properties = [];
    Object.keys(this.emptyGroup).map((property, index) => {
      properties.push(this.getProperty(property, idx));
    });
    return (
			<div className="group">
				<td dangerouslySetInnerHTML={{__html: this.state.actions}} />
				{groupLabel ? <span dangerouslySetInnerHTML={{__html: groupLabel}}/> : ""}
				{properties}
			</div>
		);
  };

  getProperty = (property, idx) => {
    const { dataTypes, isLoading, dataSourceConf } = this.state;

    // console.log('getProperty');
    const repeatableValue = this.getValue();
    let propertyDefinition = this.props.options.properties[property];
		if( this.props.options.predefinedProperties && this.props.options.predefinedProperties[idx]
			&& this.props.options.predefinedProperties[idx]["properties"]
			&& this.props.options.predefinedProperties[idx]["properties"][property] ) {
			propertyDefinition = merge(JSON.parse(JSON.stringify(propertyDefinition)), this.props.options.predefinedProperties[idx]["properties"][property]);
			// console.log(idx, property, propertyDefinition, this.props.options.predefinedProperties[idx]["properties"][property]);
		}
    const defaultDataType = propertyDefinition.type
      ? dataTypes[propertyDefinition.type]
      : {};

    if (defaultDataType) {
      merge(propertyDefinition, defaultDataType);
    }

    let editorOptions = propertyDefinition.editorOptions
      ? propertyDefinition.editorOptions
      : {};
    const editor = propertyDefinition.editor
      ? propertyDefinition.editor
      : "Neos.Neos/Inspector/Editors/TextFieldEditor";
    let value = repeatableValue[idx][property]
      ? repeatableValue[idx][property]
      : "";
			if( editorOptions.hasOwnProperty("dataSourceUri") || editorOptions.hasOwnProperty("dataSourceIdentifier") ){
				editorOptions = JSON.parse(JSON.stringify(editorOptions));
				if( editorOptions.dataSourceAdditionalData.hasOwnProperty("repeatableIndex") )
					editorOptions.dataSourceAdditionalData["repeatableIndex"] = idx;
				if( editorOptions.dataSourceAdditionalData.hasOwnProperty("repeatableValue") )
					editorOptions.dataSourceAdditionalData["repeatableValue"] = this.getValue();
			}
    return (
      <div className={Object.keys(this.props.options.properties).length > 1 ? style.property : ""} hidden={propertyDefinition.hidden}>
        <Envelope
          identifier={`repeatable-${idx}-${property}`}
          // label={propertyDefinition.label?propertyDefinition.label:''}
          options={editorOptions}
          value={value}
          renderSecondaryInspector={this.props.renderSecondaryInspector}
          editor={editor}
          editorRegistry={this.props.editorRegistry}
          i18nRegistry={this.props.i18nRegistry}
          validationErrors={this.validateElement(
            value,
            propertyDefinition,
            idx,
            property
          )}
          highlight={false}
          property={`${idx}.${property}`}
          id={`repeatable-${idx}-${property}`}
          commit={this.commitChange}
          {...propertyDefinition}
        />
      </div>
    );
  };

  onSortAction = ({ oldIndex, newIndex }) => {
    this.handleValueChange(
      arrayMoveImmutable(this.getValue(), oldIndex, newIndex)
    );
  };

  render() {
    const { options, i18nRegistry } = this.props;
    const { isLoading, allowAdd } = this.state;
    const loadingLabel = i18nRegistry.translate(
      "loading",
      "Loading",
      [],
      "Neos.Neos",
      "Main"
    );
    const { buttonAddLabel = "Add row" } = options;

    if (!isLoading) {
      return (
        <Fragment>
          <Sortable
            element={this.createElement}
            items={this.getValue()}
            onSortEndAction={this.onSortAction}
          />
          {options.controls.add && allowAdd ? (
            <Button onClick={() => this.handleAdd()}>{buttonAddLabel}</Button>
          ) : (
            ""
          )}
        </Fragment>
      );
    } else {
      return <div>{loadingLabel}</div>;
    }
  }
}
