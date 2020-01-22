import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import Sortable from './Sortable';
import Envelope from './Envelope';

import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get, $set, $transform, $merge} from 'plow-js';

import style from '../style.css';
import {SortableHandle} from "react-sortable-hoc";
import arrayMove from "array-move";
import backend from '@neos-project/neos-ui-backend-connector';

@neos(globalRegistry => ({
    editorRegistry: globalRegistry.get('inspector').get('editors'),
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class Repeatable extends PureComponent {
    emptyGroup = {};

    state = {
        dataTypes: {},
        isLoading: true
    };

    static propTypes = {
        identifier: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        options: PropTypes.object,
        value: PropTypes.object,
        renderSecondaryInspector: PropTypes.func,
        editor: PropTypes.string.isRequired,
        editorRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        validationErrors: PropTypes.array,
        onEnterKey: PropTypes.func,
        helpMessage: PropTypes.string,
        helpThumbnail: PropTypes.string,
        highlight: PropTypes.bool,

        commit: PropTypes.func.isRequired
    };

    componentDidMount() {
        backend.get().endpoints.dataSource('get-property-types', null, {}).then( (json) => {
            this.setState({dataTypes: json, isLoading: false} );
        });
    }

    constructor(props){
        super(props);
        const {properties} = props.options;

        if( properties ) {
            (Object.keys(properties)).map((property, index) => {
                this.emptyGroup[property] = '';
            });
        }
    }

    getValue = () => {
        const {value} = this.props;
        return value?value:[];
    };

    handleValueChange = (value) => {
        const {commit} = this.props;
        // console.log('handleNewChange', value);
        commit(value);
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
        this.handleValueChange($set([idx, property], event, this.props.value));

    };

    validateElement = (elementValue, elementConfiguration, idx, identifier) => {
        if (elementConfiguration && elementConfiguration.validation) {
            const validators = elementConfiguration.validation;
            const validationResults = Object.keys(validators).map(validatorName => {
                const validatorConfiguration = validators[validatorName];
                return this.checkValidator(elementValue, validatorName, validatorConfiguration);
            });
            return validationResults.filter(result => result);
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
        const {options, value} = this.props;
        const DragHandle = SortableHandle(() => <span type="button" className={style['btn-move']}>=</span>);

        return (
            <div className={style['repeatable-wrapper']}>
                {options.controls.move && value.length > 1?(<DragHandle />):''}
                <div className={style['repeatable-field-wrapper']}>
                    {this.getProperties(idx)}
                </div>
                {options.controls.remove?(<button type="button" onClick={() => this.handleRemove(idx)} className={style['btn-delete']}>-</button>):''}
            </div>
        );
    };

    getProperties = (idx) => {
        let properties = [];
        // console.log('getProperties');
        Object.keys(this.emptyGroup).map( (property, index) => {
            properties.push(this.getProperty(property, idx));
        } );
        return properties;
    };

    getProperty = (property, idx) => {
        const {dataTypes, isLoading} = this.state;

        if( isLoading ) {
            return;
        }

        // console.log('getProperty');
        const repeatableValue = this.getValue();
        let propertyDefinition = this.props.options.properties[property];
        const defaultDataType = propertyDefinition.type?dataTypes[propertyDefinition.type]:{};

        if( defaultDataType ){
            // console.log(defaultDataType);
            // console.log(propertyDefinition);
            const merge = require('lodash.merge');
            propertyDefinition = merge(defaultDataType, propertyDefinition);

        }

        const editorOptions = propertyDefinition.editorOptions?propertyDefinition.editorOptions:{};
        const editor = propertyDefinition.editor?propertyDefinition.editor:'Neos.Neos/Inspector/Editors/TextFieldEditor';
        const value = repeatableValue[idx][property]?repeatableValue[idx][property]:'';
        // return idx+' '+property;

        return (
            <Envelope
                identifier={`repeatable-${idx}-${property}`}
                label={propertyDefinition.label?propertyDefinition.label:''}
                options={editorOptions}
                value={value}
                renderSecondaryInspector={this.props.renderSecondaryInspector}
                editor={editor}
                editorRegistry={this.props.editorRegistry}
                i18nRegistry={this.props.i18nRegistry}
                validationErrors={this.validateElement(value, propertyDefinition, idx, property)}
                highlight={false}
                property={property}
                id={`repeatable-${idx}-${property}`}
                commit={this.commitChange}
            />);
    };

    onSortAction = ({oldIndex, newIndex}) => {
        this.handleValueChange(arrayMove(this.getValue(), oldIndex, newIndex))
    };

    render() {
        const {options} = this.props;
        const {isLoading} = this.state;

        if( !isLoading ){
            return (
                <Fragment>
                    <Sortable
                        element={this.createElement}
                        items={this.getValue()}
                        onSortEndAction={this.onSortAction}
                    />
                    {options.controls.add?(<button type="button" onClick={() => this.handleAdd()} className={style.btn}>{options.buttonAddLabel}</button>):''}
                </Fragment>
            );
        }else{
            return (
                <div>Is loading...</div>
            );
        }
    }
}
