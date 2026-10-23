<?php

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Book>
 */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    /** Retourne tous les livres triés par numéro */
    public function findAllOrdered(): array
    {
        return $this->createQueryBuilder('b')
            ->orderBy('b.bookNumber', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /** Livres du Testamenta Taloha (1–39) */
    public function findOldTestament(): array
    {
        return $this->createQueryBuilder('b')
            ->where('b.bookNumber <= 39')
            ->orderBy('b.bookNumber', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /** Livres du Testamenta Vaovao (40–66) */
    public function findNewTestament(): array
    {
        return $this->createQueryBuilder('b')
            ->where('b.bookNumber > 39')
            ->orderBy('b.bookNumber', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByNumber(int $number): ?Book
    {
        return $this->findOneBy(['bookNumber' => $number]);
    }
}
