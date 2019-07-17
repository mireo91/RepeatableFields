<?php
namespace Mireo\RepeatableFields\TypeConverter;

use Mireo\RepeatableFields\Model\Repeatable;
use Neos\Error\Messages\Error;
use Neos\Flow\Property\Exception;
use Neos\Flow\Property\PropertyMappingConfigurationInterface;
use Neos\Flow\Property\TypeConverter\AbstractTypeConverter;

final class RepeatableToArrayConverter extends AbstractTypeConverter
{
    protected $sourceTypes = [Repeatable::class];

    protected $targetType = 'array';

    public function convertFrom($source, $targetType, array $convertedChildProperties = [], PropertyMappingConfigurationInterface $configuration = null)
    {
        if (!$source instanceof Repeatable) {
            return null;
        }
        return $source->toArray();
    }
}
