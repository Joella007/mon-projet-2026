<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgressionResource;
use App\Models\Progression;
use App\Models\Utilisateur;
use Illuminate\Http\Request;

class ProgressionController extends Controller
{
    /**
     * Get all progressions for the authenticated student.
     */
    public function index(Request $request)
    {
        // For now, get the first user. In production, use auth()->user()
        $user = Utilisateur::first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $progressions = Progression::where('id_utilisateur', $user->id_utilisateur)
            ->with(['cours.chapitre.matiere'])
            ->get();

        return ProgressionResource::collection($progressions);
    }

    /**
     * Get progression for a specific course.
     */
    public function show($courseId)
    {
        // For now, get the first user. In production, use auth()->user()
        $user = Utilisateur::first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $progression = Progression::where('id_utilisateur', $user->id_utilisateur)
            ->where('id_cours', $courseId)
            ->with(['cours.chapitre.matiere'])
            ->first();

        if (!$progression) {
            return response()->json([
                'message' => 'Progression not found',
                'pourcentage' => 0,
                'id_cours' => $courseId,
            ], 200);
        }

        return new ProgressionResource($progression);
    }

    /**
     * Update or create progression for a course.
     */
    public function update(Request $request, $courseId)
    {
        $request->validate([
            'pourcentage' => 'required|numeric|min:0|max:100',
        ]);

        // For now, get the first user. In production, use auth()->user()
        $user = Utilisateur::first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $progression = Progression::updateOrCreate(
            [
                'id_utilisateur' => $user->id_utilisateur,
                'id_cours' => $courseId,
            ],
            [
                'pourcentage' => $request->pourcentage,
                'date_mise_a_jour' => now(),
            ]
        );

        return new ProgressionResource($progression->load('cours.chapitre.matiere'));
    }
}
