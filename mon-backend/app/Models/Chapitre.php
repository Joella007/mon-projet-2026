<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapitre extends Model
{
    protected $table = 'chapitre';

    public $timestamps = false;

    protected $primaryKey = 'id_chapitre';

    protected $fillable = [
        'titre',
        'description',
        'id_matiere',
        'date_creation',
    ];

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'id_matiere', 'id_matiere');
    }

    public function cours()
    {
        return $this->hasMany(Cours::class, 'id_chapitre', 'id_chapitre');
    }

    public function lecons()
    {
        return $this->hasMany(Lecon::class, 'id_chapitre', 'id_chapitre');
    }
}
