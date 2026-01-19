<?php

namespace Mireo\RepeatableFields\DataSource;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\Neos\Service\UserService;

/**
 * DataSource for resolving node references to their properties.
 * Used by the repeatable field preview to display meaningful information
 * about referenced nodes instead of just their identifiers.
 */
class ReferenceResolverSource extends AbstractDataSource
{
    /**
     * @var string
     */
    protected static $identifier = 'resolve-references';

    /**
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contextFactory;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * Resolve node identifiers to their properties.
     *
     * @param NodeInterface $node The node that is currently edited (provides context)
     * @param array $arguments Additional arguments containing 'identifiers' array and 'contextNodePath'
     * @return array Map of nodeIdentifier => { label, identifier, nodeType, icon, properties }
     * @api
     */
    public function getData(NodeInterface $node = null, array $arguments = [])
    {
        $identifiers = $arguments['identifiers'] ?? [];
        
        if (empty($identifiers) || !is_array($identifiers)) {
            return [];
        }

        // Get context from the node if available, otherwise create one for the current user's workspace
        if ($node !== null) {
            $context = $node->getContext();
        } else {
            $context = $this->contextFactory->create([
                'workspaceName' => $this->userService->getPersonalWorkspaceName(),
                'invisibleContentShown' => true,
                'removedContentShown' => false,
                'inaccessibleContentShown' => true
            ]);
        }

        $result = [];

        foreach ($identifiers as $identifier) {
            if (empty($identifier) || !is_string($identifier)) {
                continue;
            }

            $referencedNode = $context->getNodeByIdentifier($identifier);
            
            if ($referencedNode instanceof NodeInterface) {
                $nodeType = $referencedNode->getNodeType();
                
                // Get all node properties
                $properties = [];
                foreach ($referencedNode->getProperties() as $propertyName => $propertyValue) {
                    // Only include serializable properties (skip objects like images, assets)
                    if (is_scalar($propertyValue) || is_null($propertyValue)) {
                        $properties[$propertyName] = $propertyValue;
                    } elseif (is_array($propertyValue)) {
                        // Include arrays if they contain only scalar values
                        $isSerializable = true;
                        array_walk_recursive($propertyValue, function ($item) use (&$isSerializable) {
                            if (!is_scalar($item) && !is_null($item)) {
                                $isSerializable = false;
                            }
                        });
                        if ($isSerializable) {
                            $properties[$propertyName] = $propertyValue;
                        }
                    }
                }

                $result[$identifier] = [
                    'label' => $referencedNode->getLabel(),
                    'identifier' => $identifier,
                    'nodeType' => $nodeType->getName(),
                    'icon' => $nodeType->getConfiguration('ui.icon') ?? 'question',
                    'properties' => $properties
                ];
            }
        }

        return $result;
    }
}
