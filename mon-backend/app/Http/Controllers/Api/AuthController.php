<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * POST /api/register
     * Inscription d'un nouvel étudiant.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'                  => 'required|string|max:255',
            'prenom'               => 'required|string|max:255',
            'email'                => 'required|string|email|max:255|unique:utilisateur,email',
            'mot_de_passe'         => 'required|string|min:8|confirmed', // attend mot_de_passe_confirmation
            'id_niveau'            => 'nullable|integer|exists:niveau,id_niveau',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Récupère le rôle "Élève" (doit exister dans la table role)
        $roleEleve = Role::where('nom_role', 'Élève')->first();
        if (!$roleEleve) {
            return response()->json(['message' => 'Le rôle "Élève" est introuvable. Veuillez initialiser les rôles.'], 500);
        }

        $user = User::create([
            'nom'          => $request->nom,
            'prenom'       => $request->prenom,
            'email'        => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'id_role'      => $roleEleve->id_role,
            'id_niveau'    => $request->id_niveau,
            'statut'       => 'actif',
            'date_creation' => now(),
        ]);

        $user->load(['role', 'niveau']);

        return response()->json([
            'user'  => new UserResource($user),
            'token' => $user->createToken('auth_token')->plainTextToken,
        ], 201);
    }

    /**
     * POST /api/login
     * Connexion d'un utilisateur.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'        => 'required|email',
            'mot_de_passe' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
            return response()->json(['message' => 'Identifiants incorrects.'], 401);
        }

        if ($user->statut !== 'actif') {
            return response()->json(['message' => 'Ce compte est désactivé.'], 403);
        }

        $user->load(['role', 'niveau']);

        return response()->json([
            'user'  => new UserResource($user),
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);
    }

    /**
     * POST /api/logout
     * Déconnexion — révoque le token courant (nécessite auth:sanctum).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
}