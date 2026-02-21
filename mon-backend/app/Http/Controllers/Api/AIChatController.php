<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InteractionIAResource;
use App\Models\InteractionIa;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AIChatController extends Controller
{
    /**
     * Handle POST request to /api/ai/chat
     * Processes user question and returns AI response, saving to interaction_ia table
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:5000',
            'subject' => 'nullable|string|max:255',
        ]);

        // For now, get the first user. In production, use auth()->user()
        $user = Utilisateur::first();
        
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $userMessage = $request->input('message');
        $subject = $request->input('subject', 'general');

        // Simulate AI processing delay
        // In production, replace this with actual AI API call (OpenAI, Anthropic, etc.)
        $aiResponse = $this->generateAIResponse($userMessage, $subject);

        // Save interaction to database
        $interaction = InteractionIa::create([
            'question_utilisateur' => $userMessage,
            'reponse_ia' => $aiResponse,
            'date_interaction' => now(),
            'id_utilisateur' => $user->id_utilisateur,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réponse du chat générée avec succès',
            'data' => [
                'id' => $interaction->id_interaction,
                'user_message' => $userMessage,
                'ai_response' => $aiResponse,
                'timestamp' => $interaction->date_interaction,
            ],
            'interaction' => new InteractionIAResource($interaction->load('utilisateur')),
        ]);
    }

    /**
     * Generate AI response (placeholder - replace with actual AI service)
     * In production, integrate with OpenAI, Anthropic, or your preferred AI service
     */
    private function generateAIResponse(string $question, string $subject): string
    {
        // Simulate AI thinking time
        usleep(500000); // 0.5 seconds delay

        // Basic response generation (replace with actual AI API call)
        $responses = [
            "Excellente question ! Laissez-moi vous expliquer ce concept en détail.\n\nL'idée clé ici est de comprendre les principes fondamentaux. Quand on regarde **" . substr($question, 0, 30) . "...**, nous devons considérer plusieurs facteurs :\n\n1. **Définition de base** : Cela fait référence au concept central...\n2. **Propriétés clés** : Les principales caractéristiques incluent...\n3. **Applications** : Dans des scénarios réels...\n\nSouhaitez-vous que j'approfondisse l'un de ces points ?",
            "Je serais ravi de vous aider à mieux comprendre !\n\nDécomposons cela étape par étape :\n\n**Étape 1 :** D'abord, nous identifions les composants principaux...\n**Étape 2 :** Ensuite, nous appliquons la formule pertinente...\n**Étape 3 :** Enfin, nous interprétons les résultats...\n\nVoici un exemple pour illustrer :\n\n```\nExemple de calcul :\nx = 2y + 3\nSi y = 4, alors x = 2(4) + 3 = 11\n```\n\nCela vous aide-t-il à clarifier les choses ?",
            "Excellent sujet à explorer ! 📚\n\nC'est un concept fondamental que de nombreux étudiants trouvent difficile au début. Voici comment j'aime y penser :\n\n> \"La meilleure façon de comprendre des idées complexes est de commencer par des exemples simples.\"\n\nLaissez-moi vous donner une analogie : Pensez-y comme à des blocs de construction. Chaque pièce se connecte pour former l'image globale.\n\n**Points clés à retenir :**\n- Concentrez-vous sur la compréhension, pas la mémorisation\n- Entraînez-vous avec des exemples variés\n- Connectez les nouveaux concepts à ce que vous savez déjà\n\nSouhaitez-vous que je propose quelques exercices pratiques ?",
        ];

        // Add subject-specific context
        $subjectContext = [
            'math' => "En mathématiques, ",
            'physics' => "En physique, ",
            'chemistry' => "En chimie, ",
            'biology' => "En biologie, ",
            'cs' => "En informatique, ",
            'languages' => "En apprentissage des langues, ",
        ];

        $context = $subjectContext[strtolower($subject)] ?? "";
        $baseResponse = $responses[array_rand($responses)];
        
        return $context . $baseResponse;
    }

    /**
     * Get chat history for the authenticated user
     */
    public function history(Request $request)
    {
        // For now, get the first user. In production, use auth()->user()
        $user = Utilisateur::first();
        
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $limit = $request->input('limit', 50);
        
        $interactions = InteractionIa::where('id_utilisateur', $user->id_utilisateur)
            ->orderBy('date_interaction', 'desc')
            ->limit($limit)
            ->get();

        return InteractionIAResource::collection($interactions);
    }
}
