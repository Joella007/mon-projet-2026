<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CoursResource;
use App\Models\Cours;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    /**
     * Display a listing of all courses.
     */
    public function index()
    {
        $cours = Cours::with(['chapitre', 'exercices'])->get();
        return CoursResource::collection($cours);
    }

    /**
     * Display the specified course with chapters and lessons.
     */
    public function show($id)
    {
        $cours = Cours::with(['chapitre.lecons', 'exercices.questions'])->findOrFail($id);
        return new CoursResource($cours);
    }
}
