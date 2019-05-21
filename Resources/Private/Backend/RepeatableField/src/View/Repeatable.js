import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import style from '../style.css';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get, $set, $transform, $merge} from 'plow-js';
// import {actions} from '@neos-project/neos-ui-redux-store';
// import {connect} from 'react-redux';
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc';
import backend from '@neos-project/neos-ui-backend-connector';
import arrayMove from 'array-move'

const NeosUiEditors = window['@Neos:HostPluginAPI']['@NeosProjectPackages']().NeosUiEditors;


const SortableItem = sortableElement(({value}) => (
    <div>
        {value}
    </div>
));

const SortableContainer = sortableContainer(({children}) => {
    return (
        <div>{children}</div>
    )
});

const defaultOptions = {
    autoFocus: false,
    disabled: false,
    maxlength: null,
    readonly: false,
    buttonAddLabel: 'Add row',
    controls: {
        move: true,
        remove: true,
        add: true
    }
};

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors')
}))

export default class RepeatableField extends PureComponent {

    static propTypes = {
        value: PropTypes.object,
        commit: PropTypes.func.isRequired,
        validationErrors: PropTypes.array,
        highlight: PropTypes.bool,
        options: PropTypes.object,
        onKeyPress: PropTypes.func,
        onEnterKey: PropTypes.func,
        id: PropTypes.string,
        i18nRegistry: PropTypes.object.isRequired,
        neos: PropTypes.object
    };

    constructor(props) {
        super(props);
        // this.endpoint = false;
        this.state = {
            validationErrors: {}
        };
        this.init();
    }

    init = () => {
        const {options} = this.props;
        this.options = Object.assign({}, defaultOptions, options);
        // this.handleValueChange(value);
        this.getFromEndpoint();

        backend.get().endpoints.dataSource('get-property-types', null, {}).then( (json) => {
            this.dataTypes = json;
        });

    };

    async getFromEndpoint(){
        if( !$get('options.endpointData.url', this.props) && !$get('options.endpointData.dataSourceIdentifier', this.props) )
            return;

        var params = $get('options.endpointData.params', this.props);
        if( $get('options.endpointData.dataSourceIdentifier', this.props) )
            params['node'] = sessionStorage['Neos.Neos.lastVisitedNode'];
        const {dataSource} = backend.get().endpoints;
        dataSource(
            $get('options.endpointData.dataSourceIdentifier', this.props)?$get('options.endpointData.dataSourceIdentifier', this.props):null,
            $get('options.endpointData.url', this.props)?$get('options.endpointData.url', this.props):null,
            params
        ).then((json) => {
            if(!json)
                return;
            var length = json.length;
            var values = [];
            var currentValues = this.getValue();
            for( var i=0; i<length; i++){
                var fieldsArray = Object.keys(this.props.options.properties);
                values[i] = {};
                fieldsArray.map((identifier, idx) => {
                    var valueIdentifier = $get(`options.endpointData.parseValues.${identifier}`, this.props);
                    var value = valueIdentifier?$get(valueIdentifier, json[i]):null;
                    var currentValue = currentValues?$get(identifier, currentValues[i]):'';
                    if(currentValue && !valueIdentifier)
                        values[i][identifier] = currentValue;
                    else
                        values[i][identifier] = value?value:'';
                    if( i+1===length && idx+1===fieldsArray.length){
                        this.handleValueChange(values);
                    }
                });
            }
        });
    }

    getValue(){
        const {value} = this.props;
        // console.log(value);
        return value?value:[];
    }

    getEmptyValue = () => {
        if( this.empytValue )
            return this.empytValue;
        const {options} = this.props;
        var fields = options.properties;
        this.empytValue = {};
        Object.keys(fields).map((value => {
            this.empytValue[value] = '';
        }));
        return this.empytValue;
    }

    handleValueChange(value) {
        this.props.commit(value);
    };

    handleAdd = () => {
        var value = this.getValue();

        value = [...value, this.getEmptyValue()];
        this.handleValueChange(value);
    };

    handleRemove = (idx) => {
        var value = this.getValue().filter((s, sidx) => idx !== sidx);
        this.handleValueChange(value);
    };

    validateElement = (elementValue, elementConfiguration, idx, identifier) => {
        if (elementConfiguration && elementConfiguration.validation) {
            const validators = elementConfiguration.validation;
            const validationResults = Object.keys(validators).map(validatorName => {
                const validatorConfiguration = validators[validatorName];
                return this.checkValidator(elementValue, validatorName, validatorConfiguration);
            });
            // console.log(idx+'_'+identifier, validationResults, elementValue, elementConfiguration);
            // const id = idx+'_'+identifier;
            // if( validationResults.length > 0 && validationResults[0] != null){
            //     // if( !this.state.validationErrors[id] ){
            //         this.state.validationErrors[id] = validationResults;
            //     // }
            //     // console.log(this.state.validationErrors);
            //     // const newState = this.state;
            //     // this.setState(newState);
            //         this.props.validationErrors = validationResults;
            // }else{
            //     if( this.state.validationErrors[id] )
            //         delete this.state.validationErrors[id];
            //     // if( !this.state.validationErrors )
            //     //     this.props.validationErrors = [];
            // }
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

    // isInvalid() {
    //     const {validationErrors} = this.props;
    //     return validationErrors && validationErrors.length > 0;
    // }

    getEditorDefinition( idx, identifier ) {
        const {dataTypes} = this;
        const {editorRegistry, options} = this.props;
        const fields = this.getValue();

        const fieldData = $get('properties.'+identifier, options);

        const {createImageVariant} = backend.get().endpoints;

        var field = fieldData;
        if( field.type && dataTypes && dataTypes[field.type]){
            field = {...dataTypes[field.type], ...field};
        }

        const commitChange = (event, hook) =>{
            var value = this.getValue();
            const id = idx+'_'+identifier;

            value[idx][identifier] = event;

            console.log('value:',value);

            if( hook ){
                if( hook['Neos.UI:Hook.BeforeSave.CreateImageVariant'] ){
                    const {__identity, adjustments, originalAsset} = hook['Neos.UI:Hook.BeforeSave.CreateImageVariant'].object;

                    const uuidOfImage = originalAsset ? originalAsset.__identity : __identity;
                    if (!uuidOfImage) {
                        return Promise.reject(new Error('Received malformed originalImageUuid.'));
                    }

                    if (!adjustments) {
                        return Promise.reject(new Error('Received malformed adjustments.'));
                    }

                    createImageVariant(uuidOfImage, adjustments).then((json) => {
                        value[idx][identifier] = {'__identity': json.__identity};
                        this.handleValueChange(value);
                    });
                    return;
                }
            }else{
                this.handleValueChange(value);//test
            }
        };

        const editorOptions = field.editorOptions;
        const propertyValue = fields[idx][identifier];

        return (
            <NeosUiEditors
                label={field.label?field.label:''}
                editor={field.editor?field.editor:'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                identifier={`repeatable-${this.props.id}-${idx}-${identifier}`}
                name={`[${idx}]${identifier}`}
                commit={commitChange.bind(this)}
                value={propertyValue}
                options = {editorOptions?editorOptions:[]}
                validationErrors={this.validateElement(propertyValue, field, idx, identifier)}
                editorRegistry = {this.props.editorRegistry}
                i18nRegistry={this.props.i18nRegistry}
                renderSecondaryInspector = {this.props.renderSecondaryInspector}
            />
        );
    }

    repetableWrapper = (idx) => {
        const {options} = this;

        const DragHandle = sortableHandle(() => <span type="button" className={style['btn-move']}>=</span>);

        return (
            <div className={style['repeatable-wrapper']}>
                {options.controls.move && this.getValue().length>1?(<DragHandle />):''}
                <div className={style['repeatable-field-wrapper']}>
                    {Object.keys(options.properties).map( (identifier) => {
                        return this.getEditorDefinition(idx, identifier)
                    })}
                </div>
                {options.controls.remove?(<button type="button" onClick={() => this.handleRemove(idx)} className={style['btn-delete']}>-</button>):''}
            </div>
        );
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.handleValueChange(arrayMove(this.getValue(), oldIndex, newIndex))
    };

    render() {
        const {options} = this;

        return (
            <Fragment>
                <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                {this.getValue().map((fields, idx) => (
                    // this.repetableWrapper(idx)
                        <SortableItem key={`item-${idx}`} index={idx} value={this.repetableWrapper(idx)} />
                    )
                )}
                </SortableContainer>
                {options.controls.add?(<button type="button" onClick={() => this.handleAdd()} className={style.btn}>{options.buttonAddLabel}</button>):''}
            </Fragment>
        )
    }
}