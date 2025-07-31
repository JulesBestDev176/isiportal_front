<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ParentAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        if (!$user || $user->role !== 'parent') {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux parents'
            ], 403);
        }

        return $next($request);
    }
}