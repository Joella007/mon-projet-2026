<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    protected $table = 'utilisateur';

    public $timestamps = false;

    protected $primaryKey = 'id_utilisateur';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'statut',
        'date_creation',
        'id_role',
        'id_niveau',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role', 'id_role');
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'id_niveau', 'id_niveau');
    }

    public function inscriptions()
    {
        return $this->hasMany(InscriptionCours::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function progressions()
    {
        return $this->hasMany(Progression::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function interactions()
    {
        return $this->hasMany(InteractionIa::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function reponses()
    {
        return $this->hasMany(ReponseExercice::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function recommandations()
    {
        return $this->hasMany(Recommandation::class, 'id_utilisateur', 'id_utilisateur');
    }
}
