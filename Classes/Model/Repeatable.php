<?php

namespace Mireo\RepeatableFields\Model;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;
use Neos\Utility\Arrays;

/**
 * Repeatable
 *
 * @api
 */
class Repeatable implements \Iterator, \JsonSerializable, \Countable, \ArrayAccess
{

    /**
     * @Flow\Inject
     * @var NodePropertyConversionService
     */
    protected $nodePropertyConversionService;

    /**
     * @var array
     */
    protected $byGroups;

    /**
     * @var array
     */
    private array $byFields;

    /**
     * @var array
     */
    private array $source;

    /**
     * @var int
     */
    private $position = 0;

    /**
     * @var ContentContext
     */
    private $context;

    /**
     * @var array
     */
    private $proprties;

    public function __construct(array $source, $context, $properties)
    {
        $this->proprties = $properties;
        $this->context = $context;
        $this->source = $source;
    }

    public function initializeObject()
    {
        $source = $this->source;
        $context = $this->context;
        $properties = $this->proprties;
        $convertedProps = [];
        $byIndexes = [];
        if ($source && $context && $properties) {
            if (!is_array($source)) {
                $source = json_decode($source, true) ?? [];
            }
            if (isset($source['byGroup'])) {
                $source = $source['byGroup'];
            }
            foreach ($source as $key => $group) {
                $indexKey = null;
                if (isset($properties["indexKey"])) {
                    $indexKey = $group[$properties["indexKey"]];
                }
                foreach ($group as $index => $val) {
                    if (isset($val) && $val !== "") {
                        $conf = $properties["properties"][$index] ?? null;
                        $targ = $conf['type'] ?? 'string';

                        if ($targ == "repeatable") {
                            $v = new Repeatable(is_array($val) ? $val : [], $context, $conf["editorOptions"]);
                            //                            \Neos\Flow\var_dump($v);exit;
                        } else {
                            $propConf = [
                                'properties' => [$index => ['type' => $targ]]
                            ];
                            $nodeType = new NodeType('test', [], $propConf);
                            $nodeType->getFullConfiguration();
                            $v = $this->nodePropertyConversionService->convert($nodeType, $index, $val, $context);
                        }
                        //                        $byIndexes[$index][] = $v;
                    } else {
                        $v = $val;
                    }
                    if ($indexKey == null) {
                        $byIndexes[$index][] = $v;
                    } else {
                        $byIndexes[$indexKey][$index] = $v;
                    }
                    $convertedProps[$key][$index] = $v;
                }
            }
        }
        //        \Neos\Flow\var_dump($byIndexes);exit;
        $this->byGroups = $convertedProps;
        $this->byFields = $byIndexes;
    }

    /**
     * @return array
     */
    private function getSource(): array
    {
        return $this->source;
    }

    /**
     * @param string $fieldPath
     * @return mixed
     */
    public function getByGroups($fieldPath = null): mixed
    {
        return Arrays::getValueByPath($this->byGroups, $fieldPath);
    }

    /**
     * @param string $fieldPath
     * @return mixed
     */
    public function getByFields($fieldPath = null): mixed
    {
        if (!$fieldPath) {
            return $this->byFields;
        }
        if (is_string($fieldPath) && isset($this->byFields[$fieldPath])) {
            return $this->byFields[$fieldPath];
        }
        return Arrays::getValueByPath($this->byFields, $fieldPath);
    }

    public function count(): int
    {
        $value = $this->toArray();
        if (!is_array($value)) {
            return 0;
        }
        return count($value);
    }

    /**
     * Return the current element
     * @link https://php.net/manual/en/iterator.current.php
     * @return mixed Can return any type.
     * @since 5.0.0
     */
    public function current()
    {
        return $this->byGroups[$this->position];
    }

    /**
     * Move forward to next element
     * @link https://php.net/manual/en/iterator.next.php
     * @return void Any returned value is ignored.
     * @since 5.0.0
     */
    public function next()
    {
        $this->position++;
    }

    /**
     * Return the key of the current element
     * @link https://php.net/manual/en/iterator.key.php
     * @return mixed scalar on success, or null on failure.
     * @since 5.0.0
     */
    public function key()
    {
        return $this->position;
    }

    /**
     * Checks if current position is valid
     * @link https://php.net/manual/en/iterator.valid.php
     * @return boolean The return value will be casted to boolean and then evaluated.
     * Returns true on success or false on failure.
     * @since 5.0.0
     */
    public function valid()
    {
        if (isset($this->byGroups[$this->position])) {
            return true;
        }
        return false;
    }

    /**
     * Rewind the Iterator to the first element
     * @link https://php.net/manual/en/iterator.rewind.php
     * @return void Any returned value is ignored.
     * @since 5.0.0
     */
    public function rewind()
    {
        $this->position = 0;
    }

    public function jsonSerialize()
    {
        return $this->source;
    }

    public function toArray(): array
    {
        return is_array($this->source) ? $this->source : [];
    }

    public function __toString()
    {
        return json_encode($this->source);
    }

    private function testFieldType($offset)
    {
        return is_numeric($offset) ? true : false;
    }

    public function offsetExists(mixed $offset): bool
    {
        return true;
    }

    public function offsetGet(mixed $offset): mixed
    {
        $offset = explode(".", $offset);
        if ($this->testFieldType($offset[0])) {
            return $this->getByGroups($offset);
        } else {
            return $this->getByFields($offset);
        }
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
        // TODO: Implement offsetSet() method.
    }

    public function offsetUnset(mixed $offset): void
    {
        Arrays::unsetValueByPath($this->source, $offset);
        // TODO: Implement offsetUnset() method.
    }
}
