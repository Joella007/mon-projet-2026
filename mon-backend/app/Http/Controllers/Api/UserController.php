<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * GET /api/profile
     * Retourne le profil de l'utilisateur authentifié.
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load(['role', 'niveau']);
        return new UserResource($user);
    }

    /**
     * PUT /api/profile
     * Met à jour le profil de l'utilisateur authentifié.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'nom'       => 'sometimes|string|max:255',
            'prenom'    => 'sometimes|string|max:255',
            'id_niveau' => 'sometimes|integer|exists:niveau,id_niveau',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['nom', 'prenom', 'id_niveau']));
        $user->load(['role', 'niveau']);

        return new UserResource($user);
    }

    /**
     * PUT /api/user/password
     * Change le mot de passe.
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password'     => 'required|string',
            'new_password'         => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->mot_de_passe)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 403);
        }

        $user->update(['mot_de_passe' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }
}
