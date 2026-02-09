import { jsPDF } from "jspdf";

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

const GENDER = { Female: "Femme", Male: "Homme" };
const YESNO = { Yes: "Oui", No: "Non" };

function labelVal(key, value) {
  if (key === "Gender") return GENDER[value] ?? value;
  if (value === "Yes" || value === "No") return YESNO[value] ?? value;
  return value;
}

export function generatePdf(form, result, conseils, facteurs) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 18;
  let y = 20;

  doc.setFontSize(16);
  doc.text("Rapport de prédiction — Risque d'ostéoporose", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Date : ${new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })}`, margin, y);
  y += 8;

  doc.setFontSize(12);
  doc.text("Données du patient (anonymisées)", margin, y);
  y += 6;

  doc.setFontSize(9);
  Object.entries(form).forEach(([key, val]) => {
    const line = `${LABELS[key] || key} : ${labelVal(key, val)}`;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += 5;
  });
  y += 6;

  doc.setFontSize(12);
  doc.text("Résultat", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(`Risque d'ostéoporose : ${result.prediction}`, margin, y);
  y += 5;
  if (result.probability != null) {
    doc.text(`Probabilité estimée : ${(result.probability * 100).toFixed(1)} %`, margin, y);
    y += 5;
  }
  y += 6;

  if (facteurs && facteurs.length) {
    doc.setFontSize(11);
    doc.text("Facteurs ayant influencé la prédiction", margin, y);
    y += 6;
    doc.setFontSize(9);
    facteurs.forEach((f) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(`• ${f.facteur} (${f.valeur}) : ${f.message}`, margin, y);
      y += 5;
    });
    y += 4;
  }

  if (conseils && conseils.length) {
    doc.setFontSize(11);
    doc.text("Conseils personnalisés", margin, y);
    y += 6;
    doc.setFontSize(9);
    conseils.forEach((c) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(`• ${c.texte}`, margin, y);
      y += 5;
    });
  }

  doc.save(`rapport-osteoporose-${Date.now()}.pdf`);
}
