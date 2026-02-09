/**
 * Facteurs explicatifs (règles métier) : les 3–5 éléments du profil
 * qui poussent le plus vers Oui ou Non (risque ostéoporose).
 * Utilisé pour "Explication de la prédiction".
 */
const LABELS = {
  Age: "Âge",
  Gender: "Genre",
  "Hormonal Changes": "Changements hormonaux",
  "Family History": "Antécédents familiaux",
  "Race/Ethnicity": "Origine",
  "Body Weight": "Poids",
  "Calcium Intake": "Apport calcium",
  "Vitamin D Intake": "Vitamine D",
  "Physical Activity": "Activité physique",
  Smoking: "Tabagisme",
  "Prior Fractures": "Fractures antérieures",
};

export function getFacteurs(form, isRisk) {
  const factors = [];
  const age = Number(form.Age) || 0;

  if (age >= 65) {
    factors.push({
      facteur: LABELS.Age,
      valeur: `${age} ans`,
      sens: isRisk ? "risque" : "protecteur",
      message: isRisk
        ? "Âge élevé : facteur de risque majeur."
        : "Âge pris en compte dans l’évaluation.",
    });
  } else if (age < 50 && !isRisk) {
    factors.push({
      facteur: LABELS.Age,
      valeur: `${age} ans`,
      sens: "protecteur",
      message: "Âge plus jeune : moindre risque en général.",
    });
  }

  if (form["Hormonal Changes"] === "Postmenopausal") {
    factors.push({
      facteur: LABELS["Hormonal Changes"],
      valeur: "Post-ménopause",
      sens: isRisk ? "risque" : "neutre",
      message: isRisk
        ? "Post-ménopause associée à une baisse de la densité osseuse."
        : "Statut hormonal pris en compte.",
    });
  }

  if (form["Body Weight"] === "Underweight") {
    factors.push({
      facteur: LABELS["Body Weight"],
      valeur: "Insuffisant",
      sens: isRisk ? "risque" : "neutre",
      message: isRisk
        ? "Poids insuffisant augmente le risque."
        : "Poids pris en compte.",
    });
  } else if (form["Body Weight"] === "Normal" && !isRisk) {
    factors.push({
      facteur: LABELS["Body Weight"],
      valeur: "Normal",
      sens: "protecteur",
      message: "Poids normal favorise la santé osseuse.",
    });
  }

  if (form["Calcium Intake"] === "Low") {
    factors.push({
      facteur: LABELS["Calcium Intake"],
      valeur: "Faible",
      sens: isRisk ? "risque" : "neutre",
      message: isRisk
        ? "Apport en calcium faible : facteur de risque."
        : "Calcium pris en compte.",
    });
  } else if (form["Calcium Intake"] === "Adequate" && !isRisk) {
    factors.push({
      facteur: LABELS["Calcium Intake"],
      valeur: "Adéquat",
      sens: "protecteur",
      message: "Apport en calcium adéquat protecteur.",
    });
  }

  if (form["Vitamin D Intake"] === "Insufficient") {
    factors.push({
      facteur: LABELS["Vitamin D Intake"],
      valeur: "Insuffisant",
      sens: isRisk ? "risque" : "neutre",
      message: isRisk
        ? "Vitamine D insuffisante : risque accru."
        : "Vitamine D prise en compte.",
    });
  } else if (form["Vitamin D Intake"] === "Sufficient" && !isRisk) {
    factors.push({
      facteur: LABELS["Vitamin D Intake"],
      valeur: "Suffisant",
      sens: "protecteur",
      message: "Vitamine D suffisante protectrice.",
    });
  }

  if (form["Physical Activity"] === "Sedentary") {
    factors.push({
      facteur: LABELS["Physical Activity"],
      valeur: "Sédentaire",
      sens: isRisk ? "risque" : "neutre",
      message: isRisk
        ? "Inactivité physique augmente le risque."
        : "Activité physique prise en compte.",
    });
  } else if (form["Physical Activity"] === "Active" && !isRisk) {
    factors.push({
      facteur: LABELS["Physical Activity"],
      valeur: "Active",
      sens: "protecteur",
      message: "Activité physique régulière protectrice.",
    });
  }

  if (form.Smoking === "Yes") {
    factors.push({
      facteur: LABELS.Smoking,
      valeur: "Oui",
      sens: isRisk ? "risque" : "neutre",
      message: isRisk
        ? "Tabagisme : facteur de risque connu."
        : "Tabagisme pris en compte.",
    });
  }

  if (form["Prior Fractures"] === "Yes") {
    factors.push({
      facteur: LABELS["Prior Fractures"],
      valeur: "Oui",
      sens: isRisk ? "risque" : "neutre",
      message: isRisk
        ? "Fractures antérieures : indicateur fort de risque."
        : "Antécédents pris en compte.",
    });
  }

  if (form["Family History"] === "Yes") {
    factors.push({
      facteur: LABELS["Family History"],
      valeur: "Oui",
      sens: isRisk ? "risque" : "neutre",
      message: isRisk
        ? "Antécédents familiaux augmentent le risque."
        : "Antécédents familiaux pris en compte.",
    });
  }

  return factors.slice(0, 5);
}
