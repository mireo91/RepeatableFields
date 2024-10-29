import React from "react";
import PropTypes from "prop-types";
import { neos } from "@neos-project/neos-ui-decorators";
import omit from "lodash.omit";

const EditorEnvelope = window["@Neos:HostPluginAPI"]["@NeosProjectPackages"]().NeosUiEditors.EditorEnvelope;

function Envelope(props) {
    function commit(event, hook) {
        const { commit, id, property, hooksRegistry } = props;
        if (hook) {
            Object.keys(hook).map((h) => {
                const hookPromise = hooksRegistry.get(h);
                hookPromise(event, hook[h]).then((json) => {
                    const value = omit(json, ["__type"]);
                    commit(id, property, value);
                });
            });
            return;
        }
        commit(id, property, event);
    }
    const restProps = omit(props, ["commit"]);
    return (
        <EditorEnvelope
            commit={commit}
            options={restProps.editorOptions ? restProps.editorOptions : {}}
            {...restProps}
        />
    );
}

Envelope.propTypes = {
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.object,
    value: PropTypes.any,
    renderSecondaryInspector: PropTypes.func,
    editor: PropTypes.string.isRequired,
    editorRegistry: PropTypes.object.isRequired,
    i18nRegistry: PropTypes.object.isRequired,
    validationErrors: PropTypes.array,
    onEnterKey: PropTypes.func,
    helpMessage: PropTypes.string,
    helpThumbnail: PropTypes.string,
    highlight: PropTypes.bool,
    property: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,

    commit: PropTypes.func.isRequired,
};

const neosifier = neos((globalRegistry) => ({
    hooksRegistry: globalRegistry.get("inspector").get("saveHooks"),
}));
export default neosifier(Envelope);
