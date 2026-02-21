<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'utilisateur'; // Ta table Supabase
    protected $primaryKey = 'id_utilisateur';

    protected $fillable = [
        'nom', 'prenom', 'email', 'mot_de_passe', 'id_role', 'id_niveau',
    ];

    protected $hidden = [
        'mot_de_passe', 'remember_token',
    ];

    // On dit à Laravel que le mot de passe s'appelle 'mot_de_passe'
        public function getAuthPassword() {
            return $this->mot_de_passe;
        }
    
        public function niveau()
        {
            return $this->belongsTo(Niveau::class, 'id_niveau');
        }
    
        public $timestamps = false; // Supabase gère souvent les dates lui-même
    }
    