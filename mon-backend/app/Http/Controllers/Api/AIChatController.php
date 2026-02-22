<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InteractionIa;
use App\Models\Cours;
use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class AIChatController extends Controller
{
    // Endpoint Gemini Flash (gratuit et rapide)
    private string $geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/ai/chat
    // ─────────────────────────────────────────────────────────────────────────
    public function chat(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message'    => 'required|string|max:5000',
            'id_cours'   => 'nullable|integer|exists:cours,id_cours',
            'with_history' => 'nullable|boolean', // inclure l'historique ?
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user    = $request->user();
        $message = $request->input('message');
        $idCours = $request->input('id_cours');
        $withHistory = $request->boolean('with_history', true);

        // ── Contexte cours ────────────────────────────────────────────────
        $coursContext = '';
        $coursNom     = 'général';
        if ($idCours) {
            $cours = Cours::with('chapitre.matiere')->find($idCours);
            if ($cours) {
                $matiere  = $cours->chapitre?->matiere?->nom_matiere ?? 'matière inconnue';
                $coursNom = $cours->titre;
                $coursContext = "Le cours actuel est : \"{$cours->titre}\" ({$matiere}). Description : {$cours->description}. Niveau : {$cours->niveau}.";
            }
        }

        // ── Niveau de l'étudiant ──────────────────────────────────────────
        $niveauContext = '';
        if ($user->id_niveau) {
            $niveau = Niveau::find($user->id_niveau);
            if ($niveau) {
                $niveauContext = "Le niveau de l'étudiant est : {$niveau->nom_niveau}.";
            }
        }

        // ── Historique récent (5 derniers échanges) ───────────────────────
        $historyMessages = [];
        if ($withHistory) {
            $recent = InteractionIa::where('id_utilisateur', $user->id_utilisateur)
                ->orderBy('date_interaction', 'desc')
                ->take(5)
                ->get()
                ->reverse();

            foreach ($recent as $interaction) {
                $historyMessages[] = [
                    'role'  => 'user',
                    'parts' => [['text' => $interaction->question_utilisateur]],
                ];
                $historyMessages[] = [
                    'role'  => 'model',
                    'parts' => [['text' => $interaction->reponse_ia]],
                ];
            }
        }

        // ── System prompt ─────────────────────────────────────────────────
        $systemPrompt = $this->buildSystemPrompt($user->nom, $coursContext, $niveauContext);

        // ── Appel Gemini ──────────────────────────────────────────────────
        $aiResponse = $this->callGemini($systemPrompt, $historyMessages, $message);

        if (!$aiResponse) {
            return response()->json(['message' => 'Le service IA est temporairement indisponible.'], 503);
        }

        // ── Sauvegarder l'interaction ─────────────────────────────────────
        $interaction = InteractionIa::create([
            'question_utilisateur' => $message,
            'reponse_ia'           => $aiResponse,
            'date_interaction'     => now(),
            'date_modification'    => now(),
            'id_utilisateur'       => $user->id_utilisateur,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id'           => $interaction->id_interaction,
                'user_message' => $message,
                'ai_response'  => $aiResponse,
                'cours'        => $coursNom,
                'timestamp'    => $interaction->date_interaction,
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/ai/quiz
    // Génère un quiz automatique basé sur un cours
    // ─────────────────────────────────────────────────────────────────────────
    public function generateQuiz(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_cours'       => 'required|integer|exists:cours,id_cours',
            'nb_questions'   => 'nullable|integer|min:3|max:10',
            'difficulte'     => 'nullable|string|in:Facile,Moyen,Difficile',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user         = $request->user();
        $cours        = Cours::with('chapitre.matiere')->findOrFail($request->id_cours);
        $nbQuestions  = $request->input('nb_questions', 5);
        $difficulte   = $request->input('difficulte', 'Moyen');

        $matiere = $cours->chapitre?->matiere?->nom_matiere ?? 'matière';

        $niveauNom = 'intermédiaire';
        if ($user->id_niveau) {
            $niveau = Niveau::find($user->id_niveau);
            if ($niveau) $niveauNom = $niveau->nom_niveau;
        }

        $prompt = <<<PROMPT
Tu es un professeur expert en {$matiere}.
Génère exactement {$nbQuestions} questions QCM sur le cours "{$cours->titre}".
Description du cours : {$cours->description}
Niveau de l'étudiant : {$niveauNom}
Difficulté : {$difficulte}

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, dans ce format exact :
{
  "quiz": [
    {
      "question": "Texte de la question ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explication": "Explication de la bonne réponse."
    }
  ]
}

- "correct" est l'index (0-3) de la bonne réponse dans "options"
- Les questions doivent vraiment tester la compréhension, pas juste la mémoire
- Adapte le vocabulaire au niveau {$niveauNom}
PROMPT;

        $response = $this->callGemini('', [], $prompt, temperature: 0.3);

        if (!$response) {
            return response()->json(['message' => 'Impossible de générer le quiz.'], 503);
        }

        // Parser le JSON retourné par Gemini
        $cleaned = preg_replace('/```json|```/', '', $response);
        $decoded = json_decode(trim($cleaned), true);

        if (!$decoded || !isset($decoded['quiz'])) {
            return response()->json(['message' => 'Format de quiz invalide reçu.', 'raw' => $response], 500);
        }

        return response()->json([
            'success'   => true,
            'cours'     => $cours->titre,
            'difficulte'=> $difficulte,
            'quiz'      => $decoded['quiz'],
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/ai/chat/history
    // ─────────────────────────────────────────────────────────────────────────
    public function history(Request $request)
    {
        $user = $request->user();

        $interactions = InteractionIa::where('id_utilisateur', $user->id_utilisateur)
            ->orderBy('date_interaction', 'desc')
            ->paginate(20);

        return response()->json($interactions);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers privés
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Construit le system prompt du tuteur IA.
     */
    private function buildSystemPrompt(string $nomEleve, string $coursContext, string $niveauContext): string
    {
        return <<<PROMPT
Tu es TutorAI, un tuteur pédagogique bienveillant et expert pour la plateforme Aether Learn.
Tu aides l'élève {$nomEleve} à comprendre ses cours et à progresser.

{$coursContext}
{$niveauContext}

Tes règles :
1. Réponds toujours en français, avec un ton encourageant et clair.
2. Adapte tes explications au niveau de l'élève — simples pour débutant, approfondies pour avancé.
3. Utilise des exemples concrets et des analogies quand c'est utile.
4. Si l'élève fait une erreur, explique gentiment pourquoi sans le décourager.
5. Structure tes réponses avec des titres ou des listes quand c'est long.
6. Si une question est hors du cours, réponds quand même si c'est éducatif, sinon redirige vers le cours.
7. Tu ne fais PAS les devoirs à la place de l'élève — tu guides et expliques.
PROMPT;
    }

    /**
     * Appelle l'API Google Gemini.
     */
    private function callGemini(
        string $systemPrompt,
        array  $historyMessages,
        string $userMessage,
        float  $temperature = 0.7
    ): ?string {
        $apiKey = config('services.gemini.api_key');

        if (!$apiKey) {
            \Log::error('GEMINI_API_KEY manquante dans .env');
            return null;
        }

        // Construire le tableau "contents"
        $contents = $historyMessages;
        $contents[] = [
            'role'  => 'user',
            'parts' => [['text' => $userMessage]],
        ];

        $body = [
            'contents'         => $contents,
            'generationConfig' => [
                'temperature'     => $temperature,
                'maxOutputTokens' => 2048,
            ],
        ];

        // Ajouter le system prompt si présent
        if ($systemPrompt) {
            $body['systemInstruction'] = [
                'parts' => [['text' => $systemPrompt]],
            ];
        }

        try {
            $response = Http::timeout(30)
                ->withQueryParameters(['key' => $apiKey])
                ->post($this->geminiUrl, $body);

            if ($response->failed()) {
                \Log::error('Gemini API error: ' . $response->body());
                return null;
            }

            $data = $response->json();

            return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

        } catch (\Exception $e) {
            \Log::error('Gemini exception: ' . $e->getMessage());
            return null;
        }
    }
}

