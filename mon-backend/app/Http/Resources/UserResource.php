<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_utilisateur' => $this->id_utilisateur,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'statut' => $this->statut ?? 'actif',
            'date_creation' => $this->date_creation,
            'id_role' => $this->id_role,
            'id_niveau' => $this->id_niveau ?? 0,
            'avatar' => $this->avatar ?? null,
            'role' => new RoleResource($this->whenLoaded('role')),
            'niveau' => new NiveauResource($this->whenLoaded('niveau')),
        ];
    }
}
