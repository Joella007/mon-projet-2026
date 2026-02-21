<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MatiereResource;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MatiereController extends Controller
{
    /**
     * Display a listing of the matieres.
     */
    public function index()
    {
        try {
            $matieres = Matiere::all();
            
            // Log pour debug
            Log::info('Matières récupérées: ' . $matieres->count());
            
            return MatiereResource::collection($matieres);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des matières: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des matières',
                'error' => config('app.debug') ? $e->getMessage() : 'Erreur serveur'
            ], 500);
        }
    }
}
