// Test script pour vérifier le chargement des niveaux
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Simuler la fonction processApiResponse
const processApiResponse = (data, defaultValue, successMessage) => {
  // Si data est déjà un tableau, le retourner directement
  if (Array.isArray(data)) {
    return {
      success: true,
      data: data,
      message: successMessage
    };
  }
  
  // Si data a une structure {success, data, message}, extraire data
  if (data && typeof data === 'object' && 'data' in data) {
    let extractedData = data.data;
    
    // Si data.data est une structure paginée Laravel, extraire data.data.data
    if (extractedData && typeof extractedData === 'object' && 'data' in extractedData && Array.isArray(extractedData.data)) {
      extractedData = extractedData.data;
    }
    
    return {
      success: data.success !== false,
      data: extractedData || defaultValue,
      message: data.message || successMessage
    };
  }
  
  return {
    success: true,
    data: data || defaultValue,
    message: successMessage
  };
};

// Test avec les données de l'API
const testData = {
  "success": true,
  "message": "Liste des niveaux",
  "data": {
    "current_page": 1,
    "data": [
      {"id": 1, "nom": "6ème", "code": "6EME", "cycle": "college"},
      {"id": 2, "nom": "5ème", "code": "5EME", "cycle": "college"}
    ],
    "total": 7
  }
};

const result = processApiResponse(testData, [], 'Niveaux récupérés avec succès');
console.log('Résultat du test:', JSON.stringify(result, null, 2));
console.log('Type de data:', typeof result.data);
console.log('Est-ce un array?', Array.isArray(result.data));
console.log('Nombre d\'éléments:', result.data.length);