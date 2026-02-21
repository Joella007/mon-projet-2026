<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get the authenticated user profile.
     * For now, returns the first user for testing.
     */
    public function profile()
    {
        // For testing, get the first user. In production, use auth()->user()
        $user = Utilisateur::with(['role', 'niveau'])->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        return new UserResource($user);
    }
}
