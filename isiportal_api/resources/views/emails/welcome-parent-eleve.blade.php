<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur ISI Portal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .welcome-section {
            margin-bottom: 30px;
        }
        
        .welcome-section h2 {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 15px;
        }
        
        .welcome-section p {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        .credentials-box {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }
        
        .credentials-box h3 {
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .credential-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .credential-item:last-child {
            border-bottom: none;
        }
        
        .credential-label {
            font-weight: 600;
            font-size: 14px;
        }
        
        .credential-value {
            font-family: 'Courier New', monospace;
            background: rgba(255, 255, 255, 0.2);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .login-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            transition: transform 0.2s ease;
        }
        
        .login-button:hover {
            transform: translateY(-2px);
        }
        
        .features-section {
            margin: 30px 0;
        }
        
        .features-section h3 {
            color: #2c3e50;
            font-size: 20px;
            margin-bottom: 15px;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 6px;
        }
        
        .feature-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border-radius: 50%;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
        
        .footer {
            background-color: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            color: white;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Bienvenue sur Groupe ISI</h1>
            <p>Votre compte a été créé avec succès</p>
        </div>
        
        <div class="content">
            <div class="welcome-section">
                <h2>Bonjour {{ $user->prenom }} {{ $user->nom }},</h2>
                <p>Nous sommes ravis de vous accueillir sur la plateforme de suivi éducatif du Groupe ISI.</p>
                <p>Votre compte a été configuré avec le rôle de <strong>{{ ucfirst($user->role) }}</strong> et vous avez maintenant accès à toutes les fonctionnalités correspondantes.</p>
            </div>
            
            <div class="credentials-box">
                <h3>🔐 Vos informations de connexion</h3>
                <div class="credential-item">
                    <span class="credential-label">Email :</span>
                    <span class="credential-value">{{ $user->email }}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Mot de passe :</span>
                    <span class="credential-value">{{ $password }}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Plateforme :</span>
                    <span class="credential-value">Portail Parent/Élève</span>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ $loginUrl }}" class="login-button">
                    🚀 Accéder au portail
                </a>
            </div>
            
            <div class="features-section">
                <h3>✨ Fonctionnalités disponibles</h3>
                @if($user->role === 'parent')
                <div class="feature-item">
                    <div class="feature-icon">👨‍👩‍👧‍👦</div>
                    <span>Suivi de la scolarité de vos enfants en temps réel</span>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <span>Consultation des notes, bulletins et évaluations</span>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📅</div>
                    <span>Calendrier des événements et emplois du temps</span>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💬</div>
                    <span>Communication directe avec les enseignants</span>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📱</div>
                    <span>Notifications instantanées sur les progrès</span>
                </div>
                @else
                <div class="feature-item">
                    <div class="feature-icon">📚</div>
                    <span>Accès à vos cours, devoirs et ressources</span>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <span>Consultation de vos notes et évaluations</span>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📅</div>
                    <span>Emploi du temps et calendrier scolaire</span>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💬</div>
                    <span>Communication avec vos enseignants</span>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📱</div>
                    <span>Notifications sur les nouvelles activités</span>
                </div>
                @endif
            </div>
            
            <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">🔒 Sécurité</h3>
                <p style="color: #555; font-size: 14px; margin-bottom: 10px;">
                    <strong>Important :</strong> Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.
                </p>
                <p style="color: #555; font-size: 14px;">
                    Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter notre équipe de support.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Groupe ISI</strong> - Plateforme de suivi éducatif</p>
            <p>© {{ date('Y') }} Tous droits réservés</p>
            <div class="social-links">
                <a href="#">Support</a> |
                <a href="#">Aide</a> |
                <a href="#">Contact</a>
            </div>
        </div>
    </div>
</body>
</html> 