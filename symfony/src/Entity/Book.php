<?php

namespace App\Entity;

use App\Repository\BookRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BookRepository::class)]
#[ORM\Table(name: 'books')]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(name: 'translation_id')]
    private int $translationId = 1;

    #[ORM\Column(name: 'book_number')]
    private int $bookNumber;

    #[ORM\Column(length: 100)]
    private string $name;

    #[ORM\Column(name: 'updated_at', length: 30)]
    private string $updatedAt;

    #[ORM\OneToMany(targetEntity: Chapter::class, mappedBy: 'book', orderBy: ['chapterNumber' => 'ASC'])]
    private Collection $chapters;

    public function __construct()
    {
        $this->chapters = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getBookNumber(): int { return $this->bookNumber; }
    public function getName(): string { return $this->name; }
    public function getUpdatedAt(): string { return $this->updatedAt; }

    public function getChapters(): Collection { return $this->chapters; }
    public function getChapterCount(): int { return $this->chapters->count(); }

    /** Retourne le slug utilisé dans les URLs */
    public function getSlug(): string
    {
        return $this->bookNumber . '-' . strtolower(
            preg_replace('/[^a-z0-9]+/i', '-', iconv('UTF-8', 'ASCII//TRANSLIT', $this->name))
        );
    }

    /** Testamenta Taloha (books 1–39) ou Testamenta Vaovao (40–66) */
    public function getTestament(): string
    {
        return $this->bookNumber <= 39 ? 'Testamenta Taloha' : 'Testamenta Vaovao';
    }

    public function isOldTestament(): bool { return $this->bookNumber <= 39; }
}
