/**
 * Conseils personnalisés selon résultat (Oui/Non) et profil (âge, activité, calcium, etc.).
 * Retourne 3–5 conseils courts.
 */
export function getConseils(form, isRisk) {
  const age = Number(form.Age) || 0;
  const conseils = [];

  if (isRisk) {
    conseils.push({
      type: "alimentation",
      texte: "Augmentez les aliments riches en calcium (produits laitiers, légumes verts, amandes).",
    });
    conseils.push({
      type: "vitamine",
      texte: "Exposition au soleil raisonnable et/ou supplémentation en vitamine D (sur avis médical).",
    });
    conseils.push({
      type: "activité",
      texte: "Marche, montée d’escaliers et exercices en charge pour renforcer l’os.",
    });
    conseils.push({
      type: "suivi",
      texte: "Consultez un médecin pour un bilan (densitométrie si indiqué) et un suivi adapté.",
    });
    if (form.Smoking === "Yes") {
      conseils.push({
        type: "style",
        texte: "Arrêt du tabac recommandé pour limiter la perte osseuse.",
      });
    }
    if (form["Body Weight"] === "Underweight") {
      conseils.push({
        type: "poids",
        texte: "Stabiliser un poids santé avec une alimentation équilibrée (sur conseil médical).",
      });
    }
  } else {
    conseils.push({
      type: "maintien",
      texte: "Continuez une alimentation équilibrée et un apport calcium/vitamine D adapté.",
    });
    conseils.push({
      type: "activité",
      texte: "Maintenez une activité physique régulière (marche, gym, etc.) pour préserver l’os.",
    });
    conseils.push({
      type: "suivi",
      texte: "Contrôles de routine selon l’âge et les facteurs de risque personnels.",
    });
    if (form["Calcium Intake"] === "Low" || form["Vitamin D Intake"] === "Insufficient") {
      conseils.push({
        type: "prévention",
        texte: "Surveillez calcium et vitamine D pour une prévention durable.",
      });
    }
    if (age >= 50) {
      conseils.push({
        type: "âge",
        texte: "À partir de 50 ans, un avis médical périodique sur la santé osseuse est recommandé.",
      });
    }
  }

  return conseils.slice(0, 5);
}
