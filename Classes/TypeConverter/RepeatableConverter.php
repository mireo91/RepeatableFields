<?php
namespace Mireo\RepeatableFields\TypeConverter;

use Mireo\RepeatableFields\Model\Repeatable;
use Neos\ContentRepository\Domain\Model\NodeType;
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
        $convertedProps = [];
        $byIndexes = [];
        if( $source && $context && $properties ) {
            if (!is_array($source)) {
                $source = json_decode($source, true) ?? [];
            }
            if (isset($source['byGroup'])) {
                $source = $source['byGroup'];
            }
            foreach ($source as $key => $group) {
                foreach ($group as $index => $val) {
                    if ( isset($val) && $val!=="" ) {
                        $conf = $properties[$index]??null;
                        $targ = $conf['type'] ?? 'string';
                        $nodeType = new NodeType('test',[],[], [
                            'properties' => [$index => [ 'type' => $targ ]]
                        ]);

                        $v = $this->nodePropertyConversionService->convert($nodeType, $index, $val, $context);
                        $byIndexes[$index][] = $v;
                    } else {
                        $v = $val;
                    }
                    $convertedProps[$key][$index] = $v;
                }
            }
        }
        $repeatable = new Repeatable($convertedProps, $byIndexes, $source);

        return $repeatable;
    }

}
