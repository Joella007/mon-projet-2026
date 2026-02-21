<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    protected $table = 'niveau';

    public $timestamps = false;

    protected $primaryKey = 'id_niveau';

    protected $fillable = [
        'nom_niveau',
        'description',
    ];

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class, 'id_niveau', 'id_niveau');
    }

    public function profiles()
    {
        return $this->hasMany(Profile::class, 'id_niveau', 'id_niveau');
    }
}
