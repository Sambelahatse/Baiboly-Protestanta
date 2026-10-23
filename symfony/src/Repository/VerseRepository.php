<?php

namespace App\Repository;

use App\Entity\Verse;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Verse>
 */
class VerseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Verse::class);
    }

    /**
     * Recherche plein texte dans tous les versets.
     * Retourne au maximum $limit résultats.
     */
    public function search(string $query, int $limit = 50): array
    {
        return $this->createQueryBuilder('v')
            ->leftJoin('v.chapter', 'c')
            ->leftJoin('c.book', 'b')
            ->addSelect('c', 'b')
            ->where('v.text LIKE :q')
            ->setParameter('q', '%' . $query . '%')
            ->orderBy('b.bookNumber', 'ASC')
            ->addOrderBy('c.chapterNumber', 'ASC')
            ->addOrderBy('v.verseNumber', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /** Compte le nombre total de résultats pour une recherche */
    public function countSearch(string $query): int
    {
        return (int) $this->createQueryBuilder('v')
            ->select('COUNT(v.id)')
            ->where('v.text LIKE :q')
            ->setParameter('q', '%' . $query . '%')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
