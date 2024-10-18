<?php

namespace Mireo\RepeatableFields\DataSource;

use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Annotations as Flow;

class PropertyTypesSource extends AbstractDataSource
{

    /**
     * @var string
     */
    protected static $identifier = 'get-property-types';

    /**
     * @Flow\InjectConfiguration(package="Neos.Neos",path="userInterface.inspector.dataTypes")
     * @var array
     */
    protected $dataTypes;

    /**
     * Get data
     *
     * The return value must be JSON serializable data structure.
     *
     * @param NodeInterface $node The node that is currently edited (optional)
     * @param array $arguments Additional arguments (key / value)
     * @return mixed JSON serializable data
     * @api
     */
    public function getData(NodeInterface $node = null, array $arguments = [])
    {
        return $this->dataTypes;
    }
}
