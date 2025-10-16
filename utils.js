function capitalize(s) {
  return s && String(s[0]).toUpperCase() + String(s).slice(1);
}

function clean_string(str) {
  return str.replace(/[^a-zA-Z0-9()., ]/g, "");
}

function decode_csv(arrayBuffer) {
  /*
   Returns the CSV data as a string, trying Windows-1252 first, then UTF-8 if invalid characters are found.
  */
  let csvData;
  // Try Windows-1252 first
  const decoder1252 = new TextDecoder("Windows-1252");
  csvData = decoder1252.decode(arrayBuffer).replace(/\r/g, "");
  console.log("Trying Windows-1252 CSV decoding");
  if (csvData.includes("Ã©") || csvData.includes("Ã¨")) {
    console.log("Invalid characters with Windows-1252, trying UTF-8");
    const decoderUtf8 = new TextDecoder("utf-8");
    csvData = decoderUtf8.decode(arrayBuffer).replace(/\r/g, "");
  }
  return csvData;
}

function download_csv(data, filename) {
  const blob = new Blob([data], {
    type: "text/csv",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function build_output_row(
  reference,
  code_producteur = "NFFU9F44",
  libelle_producteur = "BIODIS",
  autres_producteurs = "",
  type_produit,
  libelle_type_produit,
  secteur,
  famille,
  selection,
  code_agriculture = "B",
  libelle_agriculture = "Biologique",
  forfait_qualite = "",
  designation,
  complement = "",
  libelle_produit = "",
  ordre = "",
  photo = "",
  fiche_technique = "",
  prix,
  unite_de_prix,
  promotion = "",
  debut_de_la_promotion = "",
  fin_de_la_promotion = "",
  tva,
  taxe_cotisation_interfel = "",
  reference_ean_13 = "",
  reference_ean_14 = "",
  unite_de_gestion = "",
  conditionnement,
  code_produit_plu = "",
  quantite,
  poids_brut,
  consigne = "",
  colisage = "",
  produit_disponible_en_ligne = "",
  delai_de_commande = "2",
  verifier_date_approvisionnement = "",
  quantite_disponible = "",
  controle_seuil_approvisionnement = "0",
  date_limite = "",
  duree_de_conservation = "0",
  logos = "[EU]",
  restriction_type_inclusion = "",
  restriction_type_exclusion = "",
  origine_production = "",
  origine_transformation,
  note_coordinateur = "",
  tarif_fournisseur,
  regle_tarifaire = "FLG05",
  tarif_hub_ethique = null,
  code_categorie_comptable = "G",
  libelle_categorie_comptable,
  compte_de_vente = "7070171000",
  compte_achat = "6070171000",
  conditionnement_pour_la_livraison = "",
  colisage_pour_la_livraison = "0",
  gestion_stock = "0",
  colisage_pour_approvisionnement = "0",
  action_en_cas_de_rupture_approvisionnement = "0",
  gamme_bio_accessible = "",
  catalogue_peripherique = "",
  saisonnalite = "",
  references_externes = "",
  zone_de_stockage = ""
) {
  return [
    `${reference}`,
    `${code_producteur}`,
    `${libelle_producteur}`,
    `${autres_producteurs}`,
    `${type_produit}`,
    `${libelle_type_produit}`,
    `${secteur}`,
    `${famille}`,
    `${selection}`,
    `${code_agriculture}`,
    `${libelle_agriculture}`,
    `${forfait_qualite}`,
    `${designation}`,
    `${complement}`,
    `${libelle_produit}`,
    `${ordre}`,
    `${photo}`,
    `${fiche_technique}`,
    `${prix}`,
    `${unite_de_prix}`,
    `${promotion}`,
    `${debut_de_la_promotion}`,
    `${fin_de_la_promotion}`,
    `${tva}`,
    `${taxe_cotisation_interfel}`,
    `${reference_ean_13}`,
    `${reference_ean_14}`,
    `${unite_de_gestion}`,
    `${conditionnement}`,
    `${code_produit_plu}`,
    `${quantite}`,
    `${poids_brut}`,
    `${consigne}`,
    `${colisage}`,
    `${produit_disponible_en_ligne}`,
    `${delai_de_commande}`,
    `${verifier_date_approvisionnement}`,
    `${quantite_disponible}`,
    `${controle_seuil_approvisionnement}`,
    `${date_limite}`,
    `${duree_de_conservation}`,
    `${logos}`,
    `${restriction_type_inclusion}`,
    `${restriction_type_exclusion}`,
    `${origine_production}`,
    `${origine_transformation}`,
    `${note_coordinateur}`,
    `${tarif_fournisseur}`,
    `${regle_tarifaire}`,
    `${tarif_hub_ethique}`,
    `${code_categorie_comptable}`,
    `${libelle_categorie_comptable}`,
    `${compte_de_vente}`,
    `${compte_achat}`,
    `${conditionnement_pour_la_livraison}`,
    `${colisage_pour_la_livraison}`,
    `${gestion_stock}`,
    `${colisage_pour_approvisionnement}`,
    `${action_en_cas_de_rupture_approvisionnement}`,
    `${gamme_bio_accessible}`,
    `${catalogue_peripherique}`,
    `${saisonnalite}`,
    `${references_externes}`,
    `${zone_de_stockage}`,
  ];
}

function parseRows(rows, headers, key = "Code art", separator = ";") {
  const parsedRows = [];
  const seenReferences = new Set();
  rows.forEach((row) => {
    if (!row || row.trim() === "") {
      // skip empty rows
      return;
    }
    const columns = row.split(separator);
    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = columns[index] || "";
    });
    const reference = rowObject[key];
    if (reference && !seenReferences.has(reference)) {
      seenReferences.add(reference);
      parsedRows.push(rowObject);
    }
  });
  return parsedRows;
}

function generate_csv(rows) {
  const outputHeaders = [
    "Référence",
    "Code Producteur",
    "Libellé Producteur",
    "Autres producteurs",
    "Type produit",
    "Libellé type produit",
    "Secteur",
    "Famille",
    "Sélection",
    "Code Agriculture",
    "Libellé Agriculture",
    "Forfait qualité",
    "Désignation",
    "Complément",
    "Libellé produit",
    "Ordre",
    "Photo",
    "Fiche technique",
    "Prix",
    "Unité de prix",
    "Promotion",
    "Début de la promotion",
    "Fin de la promotion",
    "TVA",
    "Taxe Cotisation interfel",
    "Référence EAN 13",
    "Référence EAN 14",
    "Unité de gestion",
    "Conditionnement",
    "Code produit PLU",
    "Quantité",
    "Poids Brut",
    "Consigne",
    "Colisage",
    "Produit disponible en ligne",
    "Délai de commande (jours)",
    "Vérifier date d'approvisionnement",
    "Quantité disponible",
    "Controle seuil approvisionnement",
    "Date limite",
    "Durée de conservation (jours)",
    "Logos",
    "Restriction type inclusion",
    "Restriction type exclusion",
    "Origine production",
    "Origine transformation",
    "Note coordinateur",
    "Tarif fournisseur",
    "Règle tarifaire",
    "Tarif Hub Ethique",
    "Code catégorie comptable",
    "Libellé catégorie comptable",
    "Compte de vente",
    "Compte d'achat",
    "Conditionnement pour la livraison",
    "Colisage pour la livraison",
    "Gestion Stock",
    "Colisage pour l'approvisionnement",
    "Action en cas de rupture d'approvisionnement",
    "Gamme Bio accessible",
    "Catalogue périphérique",
    "Saisonnalité",
    "Références externes",
    "Zone de stockage",
  ];
  const headers_row = outputHeaders
    .map((header) => `"${header}"`)
    .join(SEPARATOR);
  const outputRows = [headers_row].concat(rows);
  const outputCSV = outputRows.join("\n");
  return outputCSV;
}
