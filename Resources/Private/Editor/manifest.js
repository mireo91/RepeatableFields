import manifest from "@neos-project/neos-ui-extensibility";
import Repeatable from "./Repeatable";

manifest("Mireo.RepeatableFields:RepeatableField", {}, (globalRegistry) => {
    const editorsRegistry = globalRegistry.get("inspector").get("editors");

    editorsRegistry.set("Mireo.RepeatableFields/Inspector/Editors/RepeatableFieldEditor", {
        component: Repeatable,
        hasOwnLabel: true,
    });
});
