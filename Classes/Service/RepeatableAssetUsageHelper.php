<?php
namespace Mireo\RepeatableFields\Service;

use Doctrine\ORM\EntityManagerInterface;
use Neos\ContentRepository\Domain\Model\NodeData;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Media\Domain\Model\AssetInterface;
use Neos\Media\Domain\Model\Image;
use Neos\Neos\Domain\Service\SiteService;

/**
 * Helper class for finding asset usage in repeatable fields
 *
 * @Flow\Scope("singleton")
 */
class RepeatableAssetUsageHelper
{
    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @Flow\Inject
     * @var EntityManagerInterface
     */
    protected $entityManager;

    /**
     * Find nodes that use the asset in repeatable field properties
     *
     * Repeatable fields store assets in two formats:
     * - As objects: "__identity": "uuid" (images)
     * - As plain strings: "uuid" (videos, PDFs, other assets)
     *
     * @param AssetInterface $asset
     * @return array<NodeData>
     */
    public function findNodesWithAssetInRepeatableFields(AssetInterface $asset): array
    {
        $assetIdentifier = $this->persistenceManager->getIdentifierByObject($asset);
        $identifiers = [$assetIdentifier];

        if ($asset instanceof Image) {
            foreach ($asset->getVariants() as $variant) {
                $identifiers[] = $this->persistenceManager->getIdentifierByObject($variant);
            }
        }

        $queryBuilder = $this->entityManager->createQueryBuilder();
        $queryBuilder->select('n')
            ->from(NodeData::class, 'n')
            ->where('n.path LIKE :pathPrefix');

        $queryBuilder->setParameter('pathPrefix', SiteService::SITES_ROOT_PATH . '%');

        $constraints = [];
        $parameters = ['pathPrefix' => SiteService::SITES_ROOT_PATH . '%'];
        $identifierIndex = 0;

        foreach ($identifiers as $identifier) {
            $lowerIdentifier = strtolower($identifier);

            $constraints[] = '(LOWER(NEOSCR_TOSTRING(n.properties)) LIKE :identity' . $identifierIndex . ')';
            $parameters['identity' . $identifierIndex] = '%"__identity": "' . $lowerIdentifier . '"%';
            $identifierIndex++;

            $constraints[] = '(LOWER(NEOSCR_TOSTRING(n.properties)) LIKE :plain' . $identifierIndex . ')';
            $parameters['plain' . $identifierIndex] = '%": "' . $lowerIdentifier . '"%';
            $identifierIndex++;
        }

        if (!empty($constraints)) {
            $queryBuilder->andWhere(implode(' OR ', $constraints));
            $queryBuilder->setParameters($parameters);
        }

        return $queryBuilder->getQuery()->getResult();
    }
}
