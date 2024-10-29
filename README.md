# RepeatableFields

Neos package for adding repeatables fields to neos-ui react

## Demo View

![Demo of repeatable fields](repeatable.gif)

## Installation

```bash
composer require mireo91/repeatablefields
```

## Configuration

Create property with type `reapeatable`.

```YAML
  ...
  properties:
    repeatableProperty:
      type: repeatable
      ui:
        label: 'Repeatable Field Group'
        inspector:
          group: document
          editorOptions:
#            you can use data source to dynamically set editorOptions (example: {predefinedProperties: [...]})
#            dataSourceUri: ""
#            dataSourceIdentifier:
#            dataSourceDisableCaching: false
#            dataSourceAdditionalData:
#              apiKey: 'foo-bar-baz'
            buttonAddLabel: 'Add row' #default label
            max: 100 #default max
            min: 0   #default min
            indexKey: field0 # when set nested data are not available but you can get data like (.property("repeatableProperty.[value of field0].field1"))
            controls:  #default all set to true
              move: true
              remove: true
              add: true
            # Automatically sort by on property
            # Should only used with numeric or string values
            # You can pass multiple properties
            sortBy:
              - property: field0
                direction: desc # asc or desc. If not set, it will be asc
              - property: field1
            predefinedProperties:
              - label: Group label
                properties:
                  field0:
                    defaultValue: defalut value for index 0 field0
                    editorOptions:
                      readonly: true
                  field2:
                    defaultValue: defalut value for index 0 field1
              - properties:
                  field0:
                    defaultValue: defalut value for index 1 field0
              - properties:
                  field0:
                    defaultValue: defalut value for index 2 field0
#                ...
            properties:
              field0:
                # The order of the fields can be altered by setting position. It is the same logic as @position in Fusion
                # https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html#neos-fusion-join
                position: 10
                editorOptions:
                  placeholder: 'default field editor'
              field1:
                type: 'Neos\Media\Domain\Model\ImageInterface' # type for property mapper
                label: 'Image field'
                editorOptions:
                  placeholder: 'placeholder test'
              field2:
                editor: 'Neos.Neos/Inspector/Editors/TextAreaEditor'
                label: 'Textarea editor'
                editorOptions:
                  placeholder: 'test placeholder 2'
```

## Important notice

Please don't name any property (in the example `fieldN`) `_UUID_`, as this is used internaly to set a unique key to the items

## Nested

In fusion you can get data by path `q(node).property('repetableProperty').field1` so you get nested data form specific repeatable field

## Important changes between v1.x.x

Right now when you want to uprade to v2.x.x be aware that you may need to adjust some fusion because of better property mapping of object type fileds

## Issues

- early version
