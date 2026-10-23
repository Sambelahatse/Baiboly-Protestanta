<?php

namespace App\Controller;

use App\Repository\BookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class BaibolyController extends AbstractController
{
    public function __construct(
        private readonly BookRepository $bookRepository,
    ) {}

    #[Route('/', name: 'app_home')]
    public function home(): Response
    {
        $books = $this->bookRepository->findAllOrdered();

        $otBooks = array_filter($books, fn($b) => $b->isOldTestament());
        $ntBooks = array_filter($books, fn($b) => !$b->isOldTestament());

        return $this->render('home.html.twig', [
            'ot_books' => array_values($otBooks),
            'nt_books' => array_values($ntBooks),
            'total_books'    => count($books),
            'total_chapters' => array_sum(array_map(fn($b) => $b->getChapterCount(), $books)),
        ]);
    }
}
