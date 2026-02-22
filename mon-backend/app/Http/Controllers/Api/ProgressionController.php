<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Progression;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProgressionController extends Controller
{
    /**
     * GET /api/progression
     * Retourne toutes les progressions de l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $progressions = Progression::where('id_utilisateur', $user->id_utilisateur)
            ->with('cours')
            ->get();

        return response()->json($progressions);
    }

    /**
     * GET /api/cours/{id}/progress
     * Retourne la progression de l'utilisateur pour un cours.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $progression = Progression::where('id_utilisateur', $user->id_utilisateur)
            ->where('id_cours', $id)
            ->first();

        return response()->json([
            'id_cours'    => (int) $id,
            'pourcentage' => $progression ? (float) $progression->pourcentage : 0,
        ]);
    }

    /**
     * PUT /api/cours/{id}/progress
     * Met à jour (ou crée) la progression pour un cours.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'pourcentage' => 'required|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        $progression = Progression::updateOrCreate(
            [
                'id_utilisateur' => $user->id_utilisateur,
                'id_cours'       => $id,
            ],
            [
                'pourcentage'       => $request->pourcentage,
                'date_mise_a_jour'  => now(),
                'date_modification' => now(),
            ]
        );

        return response()->json($progression);
    }
}
