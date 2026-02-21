<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoursResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_cours' => $this->id_cours,
            'titre' => $this->titre,
            'description' => $this->description ?? null,
            'niveau' => $this->niveau ?? null,
            'id_chapitre' => $this->id_chapitre,
            'date_creation' => $this->date_creation,
            'thumbnail' => $this->thumbnail ?? null,
            'duration' => $this->duration ?? 0,
            'lessonsCount' => $this->lessonsCount ?? 0,
            'rating' => $this->rating ?? 0,
            'enrolledCount' => $this->enrolledCount ?? 0,
            'chapitre' => new ChapitreResource($this->whenLoaded('chapitre')),
            'exercices' => ExerciceResource::collection($this->whenLoaded('exercices')),
        ];
    }
}
