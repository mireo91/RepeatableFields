# RepeatableFields
Neos package for adding repeatables fields to neos-ui react

## Demo View
![](repeatable.gif)

## Instalation

`composer require mireo91/repeatablefields`

## Configuration
Create property with type `reapeatable`.

```YAML
  ...
  properties:
    repetableProperty:
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
            buttonAddLabel: 'Add row' #default lable
            max: 100 #default max
            min: 0   #default min
            indexKey: field0 # when setn nested data are not available but you can get data like (.property("repeatableProperty.[value of field0].field1"))
            controls:  #default all set to true
              move: true
              remove: true
              add: true
            predefinedProperties:
              - label: Group label
                properties:
                  field0:
                    defaultValue: defalut value for index 0 field0
                    editorOptions:
                      readonly: true
                  field1:
                    defaultValue: defalut value for index 0 field1 
              - value:
                  field0: 
                    defaultValue: defalut value for index 1 field0
              - value:
                  field0:
                    defaultValue: defalut value for index 2 field0
#                ...
            properties:
              filed0:
                editorOptions:
                  placeholder: 'default field editor'
              field1:
              	type: 'Neos\Media\Domain\Model\ImageInterface' #type for property mapper
                label: 'Image field'
                editorOptions:
                  placeholder: 'placeholder test'
              field2:
                editor: 'Neos.Neos/Inspector/Editors/TextAreaEditor'
                label: 'Textarea editor'
                editorOptions:
                  placeholder: 'test placeholder 2'
```

## Nested

In fusion you can get data by path  `q(node).property('repetableProperty').field1` so you get nested data form specific repeatable field  

## Important changes between v1.x.x

Right now when you want to uprade to v2.x.x be aware that you may need to adjust some fusion because of better property mapping of object type fileds 

## Issues

- early version
