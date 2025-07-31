<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EleveCoursAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        if (!$user || ($user->role !== 'eleve' && $user->role !== 'parent')) {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux élèves et parents'
            ], 403);
        }

        return $next($request);
    }
}