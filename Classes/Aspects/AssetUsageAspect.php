<?php

namespace Mireo\RepeatableFields\Aspects;

use Mireo\RepeatableFields\Service\RepeatableAssetUsageHelper;
use Neos\ContentRepository\Domain\Model\NodeData;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Media\Domain\Model\AssetInterface;

/**
 * Aspect to extend asset usage detection to support repeatable fields
 *
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class AssetUsageAspect
{
    /**
     * @Flow\Inject
     * @var RepeatableAssetUsageHelper
     */
    protected $repeatableAssetUsageHelper;

    /**
     * Extend the getRelatedNodes method to also find assets in repeatable fields
     *
     * @Flow\Around("method(Neos\Neos\Domain\Strategy\AssetUsageInNodePropertiesStrategy->getRelatedNodes())")
     * @param JoinPointInterface $joinPoint
     * @return array<NodeData>
     */
    public function extendGetRelatedNodes(JoinPointInterface $joinPoint): array
    {
        $originalNodes = $joinPoint->getAdviceChain()->proceed($joinPoint);
        /** @var AssetInterface $asset */
        $asset = $joinPoint->getMethodArgument('asset');
        $repeatableFieldNodes = $this->repeatableAssetUsageHelper->findNodesWithAssetInRepeatableFields($asset);

        $allNodes = $originalNodes;
        $existingIdentifiers = array_map(fn($node) => $node->getIdentifier(), $originalNodes);

        foreach ($repeatableFieldNodes as $node) {
            if (!in_array($node->getIdentifier(), $existingIdentifiers, true)) {
                $allNodes[] = $node;
            }
        }

        return $allNodes;
    }
}
