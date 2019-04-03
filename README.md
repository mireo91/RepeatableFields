# RepeatableFields
Neos package for adding neos-ui repeatables fields

## Demo View
![](repeatable.gif)

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
            buttonAddLabel: 'Add row' #default lable
            controls:  #default all set to true
              move: true
              remove: true
              add: true
            fields:
              filed0:
                editorOptions:
                  placeholder: 'default field editor'
              field1:
                editory: 'Neos.Neos/Inspector/Editors/ImageEditor'
                editorOptions:
                  label: 'Image field'
                  placeholder: 'placeholder test'
              field2:
                editor: 'Neos.Neos/Inspector/Editors/TextAreaEditor'
                editorOptions:
                  label: 'Textarea editor'
                  placeholder: 'test placeholder 2'
```

##Issues

- early version
- not all fields are working properly - but most of them should
