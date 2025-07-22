const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Headers CORS pour permettre les requêtes depuis votre domaine
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Gérer les requêtes OPTIONS (preflight CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Seules les requêtes POST sont autorisées
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Vérifier que la clé secrète Stripe est configurée
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY n\'est pas configurée dans les variables d\'environnement Netlify');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Configuration Stripe manquante',
          message: 'La clé secrète Stripe n\'est pas configurée sur le serveur'
        }),
      };
    }

    // Parser le body de la requête
    const { priceId, customerEmail, customerName } = JSON.parse(event.body || '{}');

    // Vérifier que le priceId est fourni
    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Prix manquant',
          message: 'L\'ID du prix Stripe est requis'
        }),
      };
    }

    console.log('🔄 Création session Stripe pour:', { priceId, customerEmail });

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // Paiement unique (pas d'abonnement)
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // URLs de redirection
      success_url: `${process.env.URL || 'http://localhost:3000'}/auth?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'http://localhost:3000'}/auth?canceled=true`,
      
      // Informations client optionnelles
      ...(customerEmail && { customer_email: customerEmail }),
      
      // Métadonnées pour identifier la transaction
      metadata: {
        product_type: 'premium_lifetime',
        app_name: 'L\'Instant Opportun',
        ...(customerName && { customer_name: customerName }),
      },
      
      // Configuration de la session
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'CA', 'US'], // Pays autorisés
      },
    });

    console.log('✅ Session Stripe créée:', session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        sessionId: session.id, 
        url: session.url,
        success: true
      }),
    };

  } catch (error) {
    console.error('❌ Erreur lors de la création de la session Stripe:', error);
    
    // Gestion des erreurs spécifiques de Stripe
    if (error.type === 'StripeCardError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Erreur de carte',
          message: error.message
        }),
      };
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Requête invalide',
          message: 'Vérifiez l\'ID du prix Stripe'
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erreur serveur',
        message: 'Une erreur inattendue s\'est produite'
      }),
    };
  }
};