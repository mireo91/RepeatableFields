<?php
namespace Mireo\RepeatableFields\Aspects;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\Flow\Aop\JoinPointInterface;

/**
 * The central security aspect, that invokes the security interceptors.
 *
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class PropertyMapperAspect
{

    /**
     * The policy enforcement advice. This advices applies the security enforcement interceptor to all methods configured in the policy.
     * Note: If we have some kind of "run as" functionality in the future, we would have to manipulate the security context
     * before calling the policy enforcement interceptor
     *
     * @Flow\Around("method(Neos\ContentRepository\Domain\Model\Node->getProperty())")
     * @param JoinPointInterface $joinPoint The current joinpoint
     * @throws
     * @return mixed The result of the target method if it has not been intercepted
     */
    public function getNodeProperty(JoinPointInterface $joinPoint)
    {
        $propertyName = $joinPoint->getMethodArgument('propertyName');
        /** @var Node $class */
        $class = $joinPoint->getProxy();
        $nodeType = $class->getNodeType();
        $propertyType = $nodeType->getPropertyType($propertyName);
        if( $propertyType == 'repeatable' ){
            $propertyValue =  $class->getNodeData()->getProperty($propertyName);

            // @todo: propertyMapper for custom fields type definition
//            $fields = $nodeType->getConfiguration("properties.$propertyName.ui.inspector.editorOptions.fields");

            //String was in older version
            if( \is_string($propertyValue) )
                $propertyValue = \json_decode($propertyValue);
            return $propertyValue;
        }

        return $joinPoint->getAdviceChain()->proceed($joinPoint);
    }
}
