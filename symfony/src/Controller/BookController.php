<?php

namespace App\Controller;

use App\Repository\BookRepository;
use App\Repository\ChapterRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/boky', name: 'book_')]
class BookController extends AbstractController
{
    public function __construct(
        private readonly BookRepository $bookRepository,
        private readonly ChapterRepository $chapterRepository,
    ) {}

    /** Liste de tous les livres */
    #[Route('', name: 'index')]
    public function index(): Response
    {
        return $this->redirectToRoute('app_home');
    }

    /** Page d'un livre : liste ses chapitres */
    #[Route('/{bookNumber<\d+>}', name: 'show')]
    public function show(int $bookNumber): Response
    {
        $book = $this->bookRepository->findByNumber($bookNumber);

        if (!$book) {
            throw $this->createNotFoundException(sprintf('Boky %d tsy hita.', $bookNumber));
        }

        return $this->render('book/show.html.twig', [
            'book' => $book,
        ]);
    }

    /** Lecture d'un chapitre */
    #[Route('/{bookNumber<\d+>}/toko/{chapterNumber<\d+>}', name: 'chapter')]
    public function chapter(int $bookNumber, int $chapterNumber): Response
    {
        $book = $this->bookRepository->findByNumber($bookNumber);

        if (!$book) {
            throw $this->createNotFoundException(sprintf('Boky %d tsy hita.', $bookNumber));
        }

        $chapter = $this->chapterRepository->findWithVerses($book, $chapterNumber);

        if (!$chapter) {
            throw $this->createNotFoundException(
                sprintf('Toko %d ao amin\'ny %s tsy hita.', $chapterNumber, $book->getName())
            );
        }

        // Navigation prev / next (dans le même livre)
        $prev = $chapterNumber > 1
            ? $this->chapterRepository->findByBookAndNumber($book, $chapterNumber - 1)
            : null;

        $nextBook = null;
        $next = $this->chapterRepository->findByBookAndNumber($book, $chapterNumber + 1);
        if (!$next && $book->getBookNumber() < 66) {
            $nextBook = $this->bookRepository->findByNumber($book->getBookNumber() + 1);
        }

        $prevBook = null;
        if (!$prev && $book->getBookNumber() > 1) {
            $prevBook = $this->bookRepository->findByNumber($book->getBookNumber() - 1);
            $prevChapters = $prevBook->getChapters();
            $prev = $prevChapters->last() ?: null;
        }

        return $this->render('book/chapter.html.twig', [
            'book'      => $book,
            'chapter'   => $chapter,
            'prev'      => $prev,
            'next'      => $next,
            'prev_book' => $prevBook,
            'next_book' => $nextBook,
        ]);
    }
}
