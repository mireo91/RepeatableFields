<?php
namespace Mireo\RepeatableFields\Model;

use Neos\Flow\Annotations as Flow;
/**
 * Repeatable
 *
 * @api
 */
class Repeatable implements \Iterator, \JsonSerializable{

    /**
     * @var array
     */
    protected $byGroups;

    /**
     * @var array
     */
    private $byFields;

    /**
     * @var array
     */
    private $source;

    /**
     * @var int
     */
    private $position = 0;

    public function __construct($byGroups, $byFields, $source) {
        $this->byGroups = $byGroups;
        $this->byFields = $byFields;
        $this->source = $source;
    }

    /**
     * @return array
     */
    private function getSource(): array{
        return $this->source;
    }

    /**
     * @return array
     */
    public function getByGroups(): array{
        return $this->byGroups;
    }

    /**
     * @param string $field
     * @return array
     */
    public function getByFields($field = null): array{
        return isset($this->byFields[$field])?$this->byFields[$field]:[];
    }

    /**
     * Return the current element
     * @link https://php.net/manual/en/iterator.current.php
     * @return mixed Can return any type.
     * @since 5.0.0
     */
    public function current(){
        return $this->byGroups[$this->position];
    }

    /**
     * Move forward to next element
     * @link https://php.net/manual/en/iterator.next.php
     * @return void Any returned value is ignored.
     * @since 5.0.0
     */
    public function next(){
        $this->position++;
    }

    /**
     * Return the key of the current element
     * @link https://php.net/manual/en/iterator.key.php
     * @return mixed scalar on success, or null on failure.
     * @since 5.0.0
     */
    public function key(){
        return $this->position;
    }

    /**
     * Checks if current position is valid
     * @link https://php.net/manual/en/iterator.valid.php
     * @return boolean The return value will be casted to boolean and then evaluated.
     * Returns true on success or false on failure.
     * @since 5.0.0
     */
    public function valid(){
        if( isset($this->byGroups[$this->position]) )
            return true;
        return false;
    }

    /**
     * Rewind the Iterator to the first element
     * @link https://php.net/manual/en/iterator.rewind.php
     * @return void Any returned value is ignored.
     * @since 5.0.0
     */
    public function rewind(){
        $this->position = 0;
    }

    public function jsonSerialize()
    {
        return $this->source;
    }

    public function toArray(){
        return $this->source;
    }
    
    public function __toString()
   {
       return json_encode($this->source);
   }
}
