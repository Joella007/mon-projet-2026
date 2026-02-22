<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\NiveauController;
use App\Http\Controllers\Api\CoursController;
use App\Http\Controllers\Api\LeconController;
use App\Http\Controllers\Api\StudentCoursesController;
use App\Http\Controllers\Api\ProgressionController;
use App\Http\Controllers\Api\AIChatController;

/*
|--------------------------------------------------------------------------
| Routes publiques (sans authentification)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Données publiques (catalogue)
Route::get('/matieres', [MatiereController::class, 'index']);
Route::get('/niveaux',  [NiveauController::class, 'index']);
Route::get('/cours',    [CoursController::class, 'index']);
Route::get('/cours/{id}', [CoursController::class, 'show']);

Route::get('/matieres/{id}/chapitres',  [LeconController::class, 'getChaptersBySubject']);
Route::get('/chapitres/{id}',           [LeconController::class, 'getChapter']);
Route::get('/chapitres/{id}/lecons',    [LeconController::class, 'getLessonsByChapter']);
Route::get('/lecons/{id}',              [LeconController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Routes protégées (auth:sanctum requis)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // Utilisateur courant (requis par le frontend /api/user)
    Route::get('/user', function (Request $request) {
        return (new \App\Http\Resources\UserResource($request->user()->load(['role', 'niveau'])));
    });

    // Profil
    Route::get('/profile',          [UserController::class, 'profile']);
    Route::put('/profile',          [UserController::class, 'update']);
    Route::put('/user/password',    [UserController::class, 'changePassword']);

    // Cours de l'étudiant
    Route::get('/user/courses',           [StudentCoursesController::class, 'index']);
    Route::get('/user/courses/{id}',      [StudentCoursesController::class, 'show']);
    Route::post('/user/courses/{id}/enroll', [StudentCoursesController::class, 'enroll']);

    // Progression
    Route::get('/progression',          [ProgressionController::class, 'index']);
    Route::get('/cours/{id}/progress',  [ProgressionController::class, 'show']);
    Route::put('/cours/{id}/progress',  [ProgressionController::class, 'update']);

    // Chat IA
    Route::post('/ai/chat',         [AIChatController::class, 'chat']);
    Route::get('/ai/chat/history',  [AIChatController::class, 'history']);
});

/*
|--------------------------------------------------------------------------
| Préfixe v1 (pour compatibilité avec le frontend)
| Redirige les mêmes routes sous /api/v1/...
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::get('/matieres',   [MatiereController::class, 'index']);
    Route::get('/niveaux',    [NiveauController::class, 'index']);
    Route::get('/cours',      [CoursController::class, 'index']);
    Route::get('/cours/{id}', [CoursController::class, 'show']);

    Route::get('/matieres/{id}/chapitres', [LeconController::class, 'getChaptersBySubject']);
    Route::get('/chapitres/{id}',          [LeconController::class, 'getChapter']);
    Route::get('/chapitres/{id}/lecons',   [LeconController::class, 'getLessonsByChapter']);
    Route::get('/lecons/{id}',             [LeconController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/user', function (Request $request) {
            return (new \App\Http\Resources\UserResource($request->user()->load(['role', 'niveau'])));
        });

        Route::get('/profile',       [UserController::class, 'profile']);
        Route::put('/profile',       [UserController::class, 'update']);
        Route::put('/user/password', [UserController::class, 'changePassword']);

        Route::get('/user/courses',              [StudentCoursesController::class, 'index']);
        Route::get('/user/courses/{id}',         [StudentCoursesController::class, 'show']);
        Route::post('/user/courses/{id}/enroll', [StudentCoursesController::class, 'enroll']);

        Route::get('/progression',         [ProgressionController::class, 'index']);
        Route::get('/cours/{id}/progress', [ProgressionController::class, 'show']);
        Route::put('/cours/{id}/progress', [ProgressionController::class, 'update']);

        Route::post('/ai/chat',        [AIChatController::class, 'chat']);
        Route::get('/ai/chat/history', [AIChatController::class, 'history']);
    });
});