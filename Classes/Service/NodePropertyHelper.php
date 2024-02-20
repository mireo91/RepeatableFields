<?php

namespace Mireo\RepeatableFields\Service;

use Mireo\RepeatableFields\Model\Repeatable;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMappingConfiguration;

class NodePropertyHelper
{
    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * @param NodeInterface $node
     * @param string $propertyName
     * @return mixed
     * @throws \Neos\ContentRepository\Exception\NodeException
     * @throws \Neos\Flow\Property\Exception
     * @throws \Neos\Flow\Security\Exception
     */
    public function getRepeatableValue(NodeInterface $node, string $propertyName)
    {
        $nodeType = $node->getNodeType();

        $explodedPropertyName = explode('.', $propertyName);

        $expectedPropertyType = "repeatable";
        $value = $node->getNodeData()->getProperty($explodedPropertyName[0]);
        $configuration = new PropertyMappingConfiguration();
        $configuration->setTypeConverterOption('Mireo\RepeatableFields\TypeConverter\RepeatableConverter', 'context', $node->getContext());
        $properties = $nodeType->getConfiguration(sprintf('properties.%s.ui.inspector.editorOptions', $explodedPropertyName[0]));
        $configuration->setTypeConverterOption('Mireo\RepeatableFields\TypeConverter\RepeatableConverter', 'properties', $properties);
        /** @var Repeatable $value */
        $value = $this->propertyMapper->convert($value, $expectedPropertyType, $configuration);
        if (isset($explodedPropertyName[1])) {
            array_shift($explodedPropertyName);
            return $value->offsetGet(implode(".", $explodedPropertyName));
        }

        return $value;
    }
}
