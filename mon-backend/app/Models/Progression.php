<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Progression extends Model
{
    protected $table = 'progression';

    public $timestamps = false;

    protected $primaryKey = 'id_progression';

    protected $fillable = [
        'pourcentage',
        'date_mise_a_jour',
        'id_utilisateur',
        'id_cours',
    ];

    protected $casts = [
        'pourcentage' => 'float',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class, 'id_cours', 'id_cours');
    }
}
