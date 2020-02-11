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
            buttonAddLabel: 'Add row' #default lable
            max: 100 #default max
            min: 0   #default min
            controls:  #default all set to true
              move: true
              remove: true
              add: true
            properties:
              filed0:
                editorOptions:
                  placeholder: 'default field editor'
              field1:
              	type: Neos\Media\Domain\Model\ImageInterface #type for property mapper
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

In fusion you can get data by path  `q(node).property('repetableProperty.field1')` so you get nested data form specific repeatable field

## Issues

- early version
