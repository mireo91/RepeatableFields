<?php

namespace Mireo\RepeatableFields\TypeConverter;

use Mireo\RepeatableFields\Model\Repeatable;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\PropertyMappingConfigurationInterface;
use Neos\Flow\Property\TypeConverter\AbstractTypeConverter;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;

/**
 * An Object Converter for Nodes which can be used for routing (but also for other
 * purposes) as a plugin for the Property Mapper.
 *
 * @Flow\Scope("singleton")
 */
class RepeatableConverter extends AbstractTypeConverter
{

    /**
     * @var array
     */
    protected $sourceTypes = ['repeatable'];

    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * @var string
     */
    protected $targetType = Repeatable::class;

    /**
     * @var integer
     */
    protected $priority = 1;

    /**
     * @Flow\Inject
     * @var NodePropertyConversionService
     */
    protected $nodePropertyConversionService;

    /**
     * @param mixed $source
     * @param string $targetType
     * @param array $subProperties
     * @param PropertyMappingConfigurationInterface|null $configuration
     * @return Repeatable|mixed|\Neos\Error\Messages\Error
     * @throws \Neos\Flow\ObjectManagement\Exception\UnresolvedDependenciesException
     */
    public function convertFrom($source, $targetType, array $subProperties = [], PropertyMappingConfigurationInterface $configuration = null)
    {
        $context = $configuration->getConfigurationValue('Mireo\RepeatableFields\TypeConverter\RepeatableConverter', 'context');
        $properties = $configuration->getConfigurationValue('Mireo\RepeatableFields\TypeConverter\RepeatableConverter', 'properties');

        if (!is_array($source)) {
            $source = json_decode($source);
        }

        $repeatable = new Repeatable((array)$source, $context, $properties);
        //        \Neos\Flow\var_dump(Neos\Utility\Arrays::getValueByPath($repeatable, "."));
        //        \Neos\Flow\var_dump(is_array($repeatable));
        //        \Neos\Flow\var_dump($repeatable[0]);exit;
        return $repeatable;
    }
}
