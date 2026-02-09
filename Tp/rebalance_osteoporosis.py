"""
Rééquilibrage âge / ostéoporose :
1) Parmi les > 40 avec Osteoporosis=1 : 200 passent à 0 (profil favorable, tous critères possibles).
2) Parmi les < 40 avec Osteoporosis=0 : une partie passe à 1 (profil défavorable).
"""
import pandas as pd
import numpy as np

df = pd.read_csv("osteoporosis.csv")
np.random.seed(42)

# ---- 1) > 40 ans : 200 "sans" ostéoporose (passer de 1 à 0) ----
mask_plus_40_avec = (df["Age"] > 40) & (df["Osteoporosis"] == 1)
candidats_plus_40 = df.loc[mask_plus_40_avec]

# Score de "profil favorable" : nombre de critères favorables (max 4)
def score_favorable(row):
    s = 0
    if row["Body Weight"] == "Normal": s += 1
    if row["Physical Activity"] == "Active": s += 1
    if row["Calcium Intake"] == "Adequate": s += 1
    if row["Prior Fractures"] == "No": s += 1
    return s

candidats_plus_40 = candidats_plus_40.copy()
candidats_plus_40["_score"] = candidats_plus_40.apply(score_favorable, axis=1)
# Trier par score décroissant (les plus favorables en premier)
candidats_plus_40 = candidats_plus_40.sort_values("_score", ascending=False)
n_a_changer_40 = min(200, len(candidats_plus_40))
indices_vers_0 = candidats_plus_40.head(n_a_changer_40).index
df.loc[indices_vers_0, "Osteoporosis"] = 0

# ---- 2) < 40 ans : certaines passent à "avec" ostéoporose (1) ----
mask_moins_40_sans = (df["Age"] < 40) & (df["Osteoporosis"] == 0)
candidats_jeunes = df.loc[mask_moins_40_sans]

def score_defavorable(row):
    s = 0
    if row["Body Weight"] == "Underweight": s += 1
    if row["Physical Activity"] == "Sedentary": s += 1
    if row["Calcium Intake"] == "Low": s += 1
    if row["Prior Fractures"] == "Yes": s += 1
    return s

candidats_jeunes = candidats_jeunes.copy()
candidats_jeunes["_score"] = candidats_jeunes.apply(score_defavorable, axis=1)
candidats_jeunes = candidats_jeunes.sort_values("_score", ascending=False)
# Environ 80 jeunes avec profil défavorable passent à Osteoporosis=1
n_jeunes_vers_1 = min(80, len(candidats_jeunes))
indices_jeunes_1 = candidats_jeunes.head(n_jeunes_vers_1).index
df.loc[indices_jeunes_1, "Osteoporosis"] = 1

# ---- Vérifications ----
n_plus_40_sans = ((df["Age"] > 40) & (df["Osteoporosis"] == 0)).sum()
n_plus_40_avec = ((df["Age"] > 40) & (df["Osteoporosis"] == 1)).sum()
n_moins_40_sans = ((df["Age"] < 40) & (df["Osteoporosis"] == 0)).sum()
n_moins_40_avec = ((df["Age"] < 40) & (df["Osteoporosis"] == 1)).sum()

print("=== > 40 ans ===")
print("SANS ostéoporose:", n_plus_40_sans)
print("AVEC ostéoporose:", n_plus_40_avec)
print("=== < 40 ans ===")
print("SANS ostéoporose:", n_moins_40_sans)
print("AVEC ostéoporose:", n_moins_40_avec)
print("\nTotal modifié :", n_a_changer_40, ">40 passés à 0 ;", n_jeunes_vers_1, "<40 passés à 1.")

df.to_csv("osteoporosis.csv", index=False)
print("Fichier osteoporosis.csv mis à jour.")
