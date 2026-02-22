<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoursResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_cours'          => $this->id_cours,
            'titre'             => $this->titre,
            'description'       => $this->description,
            'niveau'            => $this->niveau,
            'id_chapitre'       => $this->id_chapitre,
            'date_creation'     => $this->date_creation,
            'date_modification' => $this->date_modification,
            'duree'             => $this->duree,

            // Relations chargées
            'chapitre'   => new ChapitreResource($this->whenLoaded('chapitre')),
            'exercices'  => ExerciceResource::collection($this->whenLoaded('exercices')),
            'evaluations'=> EvaluationResource::collection($this->whenLoaded('evaluations')),
        ];
    }
}
