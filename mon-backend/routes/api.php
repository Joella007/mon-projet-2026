<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\CoursController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NiveauController;
use App\Http\Controllers\Api\StudentCoursesController;
use App\Http\Controllers\Api\ProgressionController;
use App\Http\Controllers\Api\LeconController;
use App\Http\Controllers\Api\AIChatController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public API Routes (without v1 prefix for compatibility)
// Matieres
Route::get('/matieres', [MatiereController::class, 'index']);
Route::get('/niveaux', [NiveauController::class, 'index']);

// Cours
Route::get('/cours', [CoursController::class, 'index']);
Route::get('/cours/{id}', [CoursController::class, 'show']);

// Student Courses (enrolled courses with progress)
Route::get('/user/courses', [StudentCoursesController::class, 'index']);
Route::get('/user/courses/{id}', [StudentCoursesController::class, 'show']);

// Progression
Route::get('/progression', [ProgressionController::class, 'index']);
Route::get('/cours/{id}/progress', [ProgressionController::class, 'show']);
Route::put('/cours/{id}/progress', [ProgressionController::class, 'update']);

// Chapitres and Lecons
Route::get('/matieres/{id}/chapitres', [LeconController::class, 'getChaptersBySubject']);
Route::get('/chapitres/{id}', [LeconController::class, 'getChapter']);
Route::get('/chapitres/{id}/lecons', [LeconController::class, 'getLessonsByChapter']);
Route::get('/lecons/{id}', [LeconController::class, 'show']);

// AI Chat
Route::post('/ai/chat', [AIChatController::class, 'chat']);
Route::get('/ai/chat/history', [AIChatController::class, 'history']);

// User Profile
Route::get('/profile', [UserController::class, 'profile']);

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Versioned API Routes (v1)
Route::prefix('v1')->group(function () {
    // Matieres
    Route::get('/matieres', [MatiereController::class, 'index']);
    Route::get('/niveaux', [NiveauController::class, 'index']);

    // Cours
    Route::get('/cours', [CoursController::class, 'index']);
    Route::get('/cours/{id}', [CoursController::class, 'show']);

    // Student Courses
    Route::get('/user/courses', [StudentCoursesController::class, 'index']);
    Route::get('/user/courses/{id}', [StudentCoursesController::class, 'show']);

    // Progression
    Route::get('/progression', [ProgressionController::class, 'index']);
    Route::get('/cours/{id}/progress', [ProgressionController::class, 'show']);
    Route::put('/cours/{id}/progress', [ProgressionController::class, 'update']);

    // Chapitres and Lecons
    Route::get('/matieres/{id}/chapitres', [LeconController::class, 'getChaptersBySubject']);
    Route::get('/chapitres/{id}', [LeconController::class, 'getChapter']);
    Route::get('/chapitres/{id}/lecons', [LeconController::class, 'getLessonsByChapter']);
    Route::get('/lecons/{id}', [LeconController::class, 'show']);

    // AI Chat
    Route::post('/ai/chat', [AIChatController::class, 'chat']);
    Route::get('/ai/chat/history', [AIChatController::class, 'history']);

    // User Profile
    Route::get('/profile', [UserController::class, 'profile']);

    // Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
});