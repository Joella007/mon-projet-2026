<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CoursResource;
use App\Models\Cours;
use App\Models\InscriptionCours;
use App\Models\Progression;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentCoursesController extends Controller
{
    /**
     * Get all courses for the authenticated student with their progress.
     * Returns courses where the student is enrolled.
     */
    public function index(Request $request)
    {
        // For now, get the first user. In production, use auth()->user()
        $user = Utilisateur::first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Get all inscriptions for this user
        $inscriptions = InscriptionCours::where('id_utilisateur', $user->id_utilisateur)
            ->with(['cours.chapitre.matiere', 'cours.exercices'])
            ->get();

        // Get all progressions for this user
        $progressions = Progression::where('id_utilisateur', $user->id_utilisateur)
            ->get()
            ->keyBy('id_cours');

        // Transform the data to include progress
        $coursesWithProgress = $inscriptions->map(function ($inscription) use ($progressions) {
            $cours = $inscription->cours;
            $progression = $progressions->get($cours->id_cours);
            
            // Create a resource and add progress data
            $resource = new CoursResource($cours);
            $data = $resource->toArray(request());
            
            // Add progress information
            $data['progress'] = $progression ? $progression->pourcentage : 0;
            $data['isEnrolled'] = true;
            $data['date_inscription'] = $inscription->date_inscription;
            $data['statut_inscription'] = $inscription->statut;
            
            return $data;
        });

        return response()->json($coursesWithProgress);
    }

    /**
     * Get a specific course for the student with detailed progress.
     */
    public function show($id)
    {
        // For now, get the first user. In production, use auth()->user()
        $user = Utilisateur::first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if user is enrolled
        $inscription = InscriptionCours::where('id_utilisateur', $user->id_utilisateur)
            ->where('id_cours', $id)
            ->first();

        if (!$inscription) {
            return response()->json(['message' => 'Course not found or not enrolled'], 404);
        }

        // Get the course with all relations
        $cours = Cours::with(['chapitre.matiere', 'chapitre.lecons', 'exercices.questions'])
            ->findOrFail($id);

        // Get progression
        $progression = Progression::where('id_utilisateur', $user->id_utilisateur)
            ->where('id_cours', $id)
            ->first();

        // Create resource
        $resource = new CoursResource($cours);
        $data = $resource->toArray(request());
        
        // Add progress and enrollment info
        $data['progress'] = $progression ? $progression->pourcentage : 0;
        $data['isEnrolled'] = true;
        $data['date_inscription'] = $inscription->date_inscription;
        $data['statut_inscription'] = $inscription->statut;

        return response()->json($data);
    }
}
