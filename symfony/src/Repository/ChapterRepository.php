<?php

namespace App\Repository;

use App\Entity\Book;
use App\Entity\Chapter;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Chapter>
 */
class ChapterRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chapter::class);
    }

    public function findByBookAndNumber(Book $book, int $chapterNumber): ?Chapter
    {
        return $this->createQueryBuilder('c')
            ->where('c.book = :book')
            ->andWhere('c.chapterNumber = :num')
            ->setParameter('book', $book)
            ->setParameter('num', $chapterNumber)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findWithVerses(Book $book, int $chapterNumber): ?Chapter
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.verses', 'v')
            ->addSelect('v')
            ->where('c.book = :book')
            ->andWhere('c.chapterNumber = :num')
            ->setParameter('book', $book)
            ->setParameter('num', $chapterNumber)
            ->orderBy('v.verseNumber', 'ASC')
            ->getQuery()
            ->getOneOrNullResult();
    }

    /** Chapitre précédent (dans le même livre ou livre précédent) */
    public function findPrevious(Chapter $chapter): ?Chapter
    {
        if ($chapter->getChapterNumber() > 1) {
            return $this->findByBookAndNumber(
                $chapter->getBook(),
                $chapter->getChapterNumber() - 1
            );
        }
        return null;
    }

    /** Chapitre suivant (dans le même livre ou livre suivant) */
    public function findNext(Chapter $chapter): ?Chapter
    {
        $book = $chapter->getBook();
        $nextNum = $chapter->getChapterNumber() + 1;

        $next = $this->findByBookAndNumber($book, $nextNum);
        return $next;
    }
}
