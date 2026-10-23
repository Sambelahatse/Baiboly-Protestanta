<?php

namespace App\Controller;

use App\Repository\VerseRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/fikarohana', name: 'search_')]
class SearchController extends AbstractController
{
    public function __construct(
        private readonly VerseRepository $verseRepository,
    ) {}

    #[Route('', name: 'index')]
    public function index(Request $request): Response
    {
        $query   = trim((string) $request->query->get('q', ''));
        $limit   = 50;
        $results = [];
        $total   = 0;

        if (mb_strlen($query) >= 2) {
            $results = $this->verseRepository->search($query, $limit);
            $total   = $this->verseRepository->countSearch($query);
        }

        return $this->render('search/index.html.twig', [
            'query'   => $query,
            'results' => $results,
            'total'   => $total,
            'limit'   => $limit,
        ]);
    }

    /** Endpoint JSON pour la recherche en temps réel (AJAX) */
    #[Route('/ajax', name: 'ajax')]
    public function ajax(Request $request): Response
    {
        $query = trim((string) $request->query->get('q', ''));

        if (mb_strlen($query) < 2) {
            return $this->json(['results' => [], 'total' => 0]);
        }

        $verses  = $this->verseRepository->search($query, 20);
        $total   = $this->verseRepository->countSearch($query);

        $data = array_map(fn($v) => [
            'ref'  => $v->getReference(),
            'text' => $v->getText(),
            'url'  => $this->generateUrl('book_chapter', [
                'bookNumber'    => $v->getChapter()->getBook()->getBookNumber(),
                'chapterNumber' => $v->getChapter()->getChapterNumber(),
            ]) . '#v' . $v->getVerseNumber(),
        ], $verses);

        return $this->json(['results' => $data, 'total' => $total]);
    }
}
