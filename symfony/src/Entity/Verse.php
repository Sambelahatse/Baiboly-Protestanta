<?php

namespace App\Entity;

use App\Repository\VerseRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VerseRepository::class)]
#[ORM\Table(name: 'verses')]
class Verse
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Chapter::class, inversedBy: 'verses')]
    #[ORM\JoinColumn(name: 'chapter_id', nullable: false)]
    private Chapter $chapter;

    #[ORM\Column(name: 'verse_number')]
    private int $verseNumber;

    #[ORM\Column(type: 'text')]
    private string $text;

    #[ORM\Column(name: 'updated_at', length: 30)]
    private string $updatedAt;

    public function getId(): ?int { return $this->id; }
    public function getChapter(): Chapter { return $this->chapter; }
    public function getVerseNumber(): int { return $this->verseNumber; }
    public function getText(): string { return trim($this->text); }
    public function getUpdatedAt(): string { return $this->updatedAt; }

    /** Référence lisible : ex. "Jaona 3:16" */
    public function getReference(): string
    {
        return sprintf(
            '%s %d:%d',
            $this->chapter->getBook()->getName(),
            $this->chapter->getChapterNumber(),
            $this->verseNumber
        );
    }
}
