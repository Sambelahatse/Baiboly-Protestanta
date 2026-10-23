<?php

namespace App\Entity;

use App\Repository\ChapterRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChapterRepository::class)]
#[ORM\Table(name: 'chapters')]
class Chapter
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Book::class, inversedBy: 'chapters')]
    #[ORM\JoinColumn(name: 'book_id', nullable: false)]
    private Book $book;

    #[ORM\Column(name: 'chapter_number')]
    private int $chapterNumber;

    #[ORM\Column(name: 'updated_at', length: 30)]
    private string $updatedAt;

    #[ORM\OneToMany(targetEntity: Verse::class, mappedBy: 'chapter', orderBy: ['verseNumber' => 'ASC'])]
    private Collection $verses;

    public function __construct()
    {
        $this->verses = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getBook(): Book { return $this->book; }
    public function getChapterNumber(): int { return $this->chapterNumber; }
    public function getUpdatedAt(): string { return $this->updatedAt; }
    public function getVerses(): Collection { return $this->verses; }
    public function getVerseCount(): int { return $this->verses->count(); }
}
