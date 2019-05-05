<?php
namespace Mireo\RepeatableFields\Aspects;

use Mireo\RepeatableFields\Model\Repeatable;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\PropertyMappingConfiguration;
use Neos\Neos\Domain\Service\ContentContext;

/**
 * The central security aspect, that invokes the security interceptors.
 *
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class PropertyMapperAspect
{

    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * Proper property mapper for repeatable field
     * @Flow\Around("method(Neos\ContentRepository\Domain\Model\Node->getProperty())")
     * @param JoinPointInterface $joinPoint The current joinpoint
     * @throws
     * @return mixed The result of the target method if it has not been intercepted
     */
    public function getProperty(JoinPointInterface $joinPoint){
        $propertyName = $joinPoint->getMethodArgument('propertyName');
        /** @var Node $node */
        $node = $joinPoint->getProxy();

        /** @var NodeType $nodeType */
        $nodeType = $node->getNodeType();

        $explodedPropertyName = explode('.', $propertyName);

        if( $explodedPropertyName ) {

            if ($nodeType !== null) {
                $expectedPropertyType = $nodeType->getPropertyType($explodedPropertyName[0]);
            }

            if ($expectedPropertyType == 'repeatable') {
                $value = $node->getNodeData()->getProperty($explodedPropertyName[0]);
                $configuration = new PropertyMappingConfiguration();
                $fields = $nodeType->getConfiguration("properties.${explodedPropertyName[0]}.ui.inspector.editorOptions.properties");
                foreach ($fields as $field => $option) {
                    $configuration->setTypeConverterOption('Mireo\RepeatableFields\TypeConverter\RepeatableConverter', $field, $option);
                }

                /** @var Repeatable $value */
                $value = $this->propertyMapper->convert($value, $expectedPropertyType, $configuration);

                if (isset($explodedPropertyName[1])) {
                    return $value->getByField($explodedPropertyName[1]);
                }else{
                    return $value;
                }
            }
        }
        return $joinPoint->getAdviceChain()->proceed($joinPoint);
    }

    /**
     * The policy enforcement advice. This advices applies the security enforcement interceptor to all methods configured in the policy.
     * Note: If we have some kind of "run as" functionality in the future, we would have to manipulate the security context
     * before calling the policy enforcement interceptor
     *
     * @Flow\Before("method(Neos\Flow\Property\PropertyMapper->findFirstEligibleTypeConverterInObjectHierarchy())")
     * @param JoinPointInterface $joinPoint The current joinpoint
     * @throws
     * @return mixed The result of the target method if it has not been intercepted
     */
    public function findFirstEligibleTypeConverterInObjectHierarchy(JoinPointInterface $joinPoint){
        $targetType = $joinPoint->getMethodArgument('targetType');
        if( $targetType == 'repeatable' ){
            $joinPoint->setMethodArgument('sourceType', $targetType);
            $targetType = 'Mireo\RepeatableFields\Model\Repeatable';
            $joinPoint->setMethodArgument('targetType', $targetType);
        }
    }
}
