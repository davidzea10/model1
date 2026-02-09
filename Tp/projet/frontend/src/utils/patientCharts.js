/**
 * Données pour les graphiques "profil patient" (scores de risque 0–100 par dimension).
 * Règles métier simplifiées pour affichage visuel.
 */
export function getProfilRisqueBars(form) {
  const age = Number(form.Age) || 50;
  let ageScore = 30;
  if (age >= 65) ageScore = 85;
  else if (age >= 50) ageScore = 55;
  else if (age >= 40) ageScore = 40;
  else ageScore = 25;

  const weightScore =
    form["Body Weight"] === "Underweight" ? 75 : form["Body Weight"] === "Normal" ? 30 : 45;
  const calciumScore = form["Calcium Intake"] === "Low" ? 70 : 25;
  const vitDScore = form["Vitamin D Intake"] === "Insufficient" ? 70 : 25;
  const activityScore = form["Physical Activity"] === "Sedentary" ? 65 : 25;
  const otherScore =
    (form.Smoking === "Yes" ? 50 : 0) + (form["Prior Fractures"] === "Yes" ? 80 : 0);
  const otherScoreNorm = Math.min(100, Math.round(otherScore / 1.3));

  return [
    { label: "Âge", value: ageScore, id: "age" },
    { label: "Poids", value: weightScore, id: "weight" },
    { label: "Calcium", value: calciumScore, id: "calcium" },
    { label: "Vitamine D", value: vitDScore, id: "vitd" },
    { label: "Activité physique", value: activityScore, id: "activity" },
    { label: "Tabac / Fractures", value: otherScoreNorm, id: "other" },
  ];
}

/**
 * Données pour le graphique "impact des facteurs" (facteurs qui ont poussé vers Oui/Non).
 * Chaque facteur a un sens (risque/protecteur) et un poids affiché en barre.
 */
export function getFacteursChartData(facteurs) {
  return facteurs.map((f, i) => ({
    label: f.facteur,
    sens: f.sens,
    weight: f.sens === "risque" ? 80 : f.sens === "protecteur" ? 70 : 40,
  }));
}
