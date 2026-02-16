import { jsPDF } from "jspdf";

const FONT_SIZE_NORMAL = 10;
const FONT_SIZE_SMALL = 9;
const FONT_SIZE_HEADING = 12;
const FONT_SIZE_TITLE = 16;
const MARGIN = 20;
const LINE_HEIGHT = 5;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

function addHeader(doc, companyName, pageNum, totalPages) {
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.setTextColor(100, 100, 100);
  doc.text("Pelastussuunnitelma", MARGIN, 10);
  doc.text(companyName, MARGIN, 15);
  doc.text(`Sivu ${pageNum} / ${totalPages}`, PAGE_WIDTH - MARGIN - 30, 12);
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN, 18, PAGE_WIDTH - MARGIN, 18);
}

function wrapText(doc, text, maxWidth) {
  return doc.splitTextToSize(text || "", maxWidth);
}

function addWrapped(doc, text, x, y, maxWidth, lineHeight = LINE_HEIGHT) {
  const lines = wrapText(doc, text, maxWidth);
  lines.forEach((line) => {
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

export function generateEmergencyPlanPdf(formData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const contentWidth = PAGE_WIDTH - 2 * MARGIN;
  let y = 20;
  let page = 0; // content page number (1–9)
  const totalPages = 9;

  const nextPage = () => {
    doc.addPage();
    page += 1;
    addHeader(doc, formData.companyName || "Yritys", page, totalPages);
    y = 25;
  };

  // ---- Title page ----
  doc.setFontSize(FONT_SIZE_TITLE);
  doc.setFont(undefined, "bold");
  doc.text("PELASTUSSUUNNITELMA", PAGE_WIDTH / 2, 40, { align: "center" });
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_NORMAL);
  doc.text(formData.companyName || "", PAGE_WIDTH / 2, 50, { align: "center" });
  doc.text(formData.address || "", PAGE_WIDTH / 2, 56, { align: "center" });
  doc.text(`Päiväys: ${formData.documentDate || "[pp.kk.vvvv]"}`, PAGE_WIDTH / 2, 62, { align: "center" });
  doc.addPage();
  page = 1;
  addHeader(doc, formData.companyName || "Yritys", page, totalPages);
  y = 25;

  // ---- 1. Dokumentinhallinta ----
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.setFont(undefined, "bold");
  doc.text("1. Dokumentinhallinta", MARGIN, y);
  y += 10;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_NORMAL);
  doc.text(`Kohde ${formData.companyName || ""}, ${formData.address || ""}`, MARGIN, y);
  y += 6;
  doc.text(`Laatija ${formData.authorName || "[nimi / rooli]"}`, MARGIN, y);
  y += 6;
  doc.text(`Hyväksyjä ${formData.approverName || "[nimi / rooli]"}`, MARGIN, y);
  y += 6;
  doc.text("Voimassaolo Voimassa, kun hyväksytty ja jaettu toimijoille.", MARGIN, y);
  y += 6;
  doc.text(`Seuraava tarkistus ${formData.nextReviewDate || "[pp.kk.vvvv]"} (vähintään vuosittain ja muutosten jälkeen)`, MARGIN, y);
  y += 12;

  // ---- 2. Kohteen perustiedot ----
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.setFont(undefined, "bold");
  doc.text("2. Kohteen perustiedot", MARGIN, y);
  y += 10;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_NORMAL);
  doc.text(`Yritys / omistaja ${formData.companyName || ""} (Y-tunnus ${formData.businessId || ""})`, MARGIN, y);
  y += 6;
  doc.text(`Kiinteistötunnus ${formData.propertyId || ""}`, MARGIN, y);
  y += 6;
  doc.text(`Kaavamerkintä ${formData.zoningMark || ""}`, MARGIN, y);
  y += 6;
  doc.text(`Tontin pinta-ala ${formData.lotArea || ""}`, MARGIN, y);
  y += 6;
  doc.text(`Rakennusvuosi / laajennukset ${formData.buildYear || ""}`, MARGIN, y);
  y += 6;
  doc.text(`Rakennustyyppi ${formData.buildingType || ""}`, MARGIN, y);
  y += 6;
  doc.text(`Lämmitys ${formData.heating || ""}`, MARGIN, y);
  y += 6;
  doc.text(`Kokonaispinta-ala ${formData.totalArea || ""}`, MARGIN, y);
  y += 12;

  // ---- 3. Tilojen käyttö ----
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.setFont(undefined, "bold");
  doc.text("3. Tilojen käyttö ja käyttäjät", MARGIN, y);
  y += 10;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_SMALL);
  y = addWrapped(doc, formData.premisesUse || "Täydennä tilojen käyttö ja käyttäjät.", MARGIN, y, contentWidth, 5) + 8;

  if (y > PAGE_HEIGHT - 30) { nextPage(); }

  // ---- 4. Turvallisuusorganisaatio ----
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.setFont(undefined, "bold");
  doc.text("4. Turvallisuusorganisaatio, tehtävät ja vastuut", MARGIN, y);
  y += 10;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.text("Rooli\tNimi ja yhteystieto", MARGIN, y);
  y += 6;
  doc.text(`Kiinteistön omistajan edustaja / pelastussuunnitelman vastuuhenkilö\t${formData.ownerContact || "[nimi, puhelin]"}`, MARGIN, y);
  y += 5;
  doc.text(`Turvallisuusvastaava\t${formData.safetyOfficer || "[nimi, puhelin]"}`, MARGIN, y);
  y += 5;
  doc.text(`Varahenkilö\t${formData.deputyContact || "[nimi, puhelin]"}`, MARGIN, y);
  y += 5;
  doc.text(`Alkusammutusvastaava(t)\t${formData.extinguisherContact || "[nimi(t), puhelin]"}`, MARGIN, y);
  y += 5;
  doc.text(`Ensiapuvastaava(t)\t${formData.firstAidContact || "[nimi(t), puhelin]"}`, MARGIN, y);
  y += 5;
  doc.text(`Kiinteistöhuolto\t${formData.propertyMaintenance || "[yritys, päivystysnumero]"}`, MARGIN, y);
  y += 5;
  doc.text(`Sähkö-/LVI-huolto\t${formData.electricityContact || "[yritys, numero]"}`, MARGIN, y);
  y += 5;
  doc.text(`Vuokralaisten yhteyshenkilöt\t${formData.tenantContacts || "[nimi/tila, puhelin]"}`, MARGIN, y);
  y += 12;

  if (y > PAGE_HEIGHT - 40) { nextPage(); }

  // ---- 5. Vaarojen ja riskien arviointi (abbreviated) ----
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.setFont(undefined, "bold");
  doc.text("5. Vaarojen ja riskien arviointi sekä johtopäätökset", MARGIN, y);
  y += 10;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_SMALL);
  y = addWrapped(doc, "Riskien arviointi tehdään kohteen toiminnan ja tilojen käytön perusteella. Tarkenna riskikoonti tilakohtaisesti (erityisesti kemikaalit, polttoaineet ja tulityöt). Riskien arviointi tulee käydä läpi vähintään vuosittain ja aina, kun tilojen käyttö, vuokralaiset tai prosessit muuttuvat.", MARGIN, y, contentWidth, 5) + 8;

  if (y > PAGE_HEIGHT - 50) { nextPage(); }

  // ---- 6. Rakennuksen turvallisuusjärjestelyt ----
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.setFont(undefined, "bold");
  doc.text("6. Rakennuksen turvallisuusjärjestelyt", MARGIN, y);
  y += 8;
  doc.setFont(undefined, "bold");
  doc.setFontSize(FONT_SIZE_NORMAL);
  doc.text("6.1 Poistumisturvallisuus ja kokoontuminen", MARGIN, y);
  y += 6;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.text("Kokoontumispaikka:", MARGIN, y);
  y += 5;
  y = addWrapped(doc, formData.assemblyPoint || "[MÄÄRITÄ: pihan kokoontumispaikka ja mahdollinen varakokoontumispaikka.]", MARGIN, y, contentWidth, 5) + 6;
  y = addWrapped(doc, "Poistumisreitit ja uloskäytävät pidetään aina vapaina. Uloskäyntiovien tulee olla avattavissa sisältä ilman avainta. Poistumistilanteessa ei palata hakemaan tavaroita.", MARGIN, y, contentWidth, 5) + 10;

  doc.setFont(undefined, "bold");
  doc.text("6.2 Alkusammutus- ja ensiapuvalmius", MARGIN, y);
  y += 6;
  doc.setFont(undefined, "normal");
  doc.text(`Käsisammuttimet: ${formData.extinguishers || "[määrä/tyyppi/sijainnit]"}`, MARGIN, y);
  y += 5;
  doc.text(`Sammutuspeitteet: ${formData.fireBlankets || "[sijainnit]"}`, MARGIN, y);
  y += 5;
  doc.text(`Ensiapulaukut/kaapit: ${formData.firstAidKits || "[sijainnit]"}`, MARGIN, y);
  y += 5;
  doc.text(`Defibrillaattori (AED): ${formData.aedLocation || "[sijainti, jos on]"}`, MARGIN, y);
  y += 10;

  if (y > PAGE_HEIGHT - 50) { nextPage(); }

  doc.setFont(undefined, "bold");
  doc.text("6.3 Pelastustiet ja opastus", MARGIN, y);
  y += 6;
  doc.setFont(undefined, "normal");
  doc.text(`Osoite 112-yksiköille: ${formData.address || ""}`, MARGIN, y);
  y += 8;
  doc.setFont(undefined, "bold");
  doc.text("6.4 Tekniset tilat ja pääsulut", MARGIN, y);
  y += 6;
  doc.setFont(undefined, "normal");
  doc.text(`Sähköpääkeskus: ${formData.electricalShutoff || "[sijainti]"}`, MARGIN, y);
  y += 5;
  doc.text(`Veden pääsulku: ${formData.waterShutoff || "[sijainti]"}`, MARGIN, y);
  y += 5;
  doc.text(`Ilmanvaihdon hätäpysäytys: ${formData.ventilationShutoff || "[sijainti]"}`, MARGIN, y);
  y += 12;

  if (y > PAGE_HEIGHT - 60) { nextPage(); }

  // ---- 7. Toimintaohjeet ----
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.setFont(undefined, "bold");
  doc.text("7. Toimintaohjeet vaara- ja vahinkotilanteissa", MARGIN, y);
  y += 10;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.text("7.1 Hätäilmoitus (112): Kerro mitä on tapahtunut, tarkka osoite ja kunta. Vastaa kysymyksiin. Älä sulje puhelinta ennen kuin saat luvan.", MARGIN, y);
  y += 8;
  doc.text("7.2 Toiminta tulipalossa: Pysy rauhallisena. Pelasta itsesi ja auta muita. Varoita muita ja hälytä 112. Sammuta alkava palo vain jos turvallista. Poistu kokoontumispaikalle.", MARGIN, y);
  y += 8;
  doc.text("7.3 Tapaturma: Arvioi tilanne, aloita ensiapu, soita 112, kirjaa ja ilmoita vastuuhenkilölle.", MARGIN, y);
  y += 8;
  doc.text("7.4 Kemikaali-/polttoainevuoto: Estä syttymislähteet, rajoita vuotoa, hälytä tarvittaessa 112.", MARGIN, y);
  y += 8;
  doc.text("7.5 Yleinen vaaramerkki: Siirry sisälle, sulje ovet ja ikkunat, odota ohjeita.", MARGIN, y);
  y += 12;

  if (y > PAGE_HEIGHT - 50) { nextPage(); }

  // ---- 8 & 9 ----
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.setFont(undefined, "bold");
  doc.text("8. Perehdytys, harjoitukset ja tiedottaminen", MARGIN, y);
  y += 8;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_SMALL);
  y = addWrapped(doc, "Pelastussuunnitelmasta tiedotetaan kaikille (omistaja, vuokralaiset, asukkaat, huolto). Perehdytys vähintään: uuden vuokralaisen aloituksen yhteydessä; vuosittain turvallisuuskierroksella; poistumisharjoituksella soveltuvin osin.", MARGIN, y, contentWidth, 5) + 10;

  doc.setFont(undefined, "bold");
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.text("9. Ylläpito ja tarkastukset", MARGIN, y);
  y += 8;
  doc.setFont(undefined, "normal");
  doc.setFontSize(FONT_SIZE_SMALL);
  y = addWrapped(doc, "Suunnitelma pidetään ajan tasalla. Tarkastuslista: poistumisreitit ja ovet; alkusammutuskalusto; ensiaputarvikkeet; sähkökeskuksen edusta; piha-alue.", MARGIN, y, contentWidth, 5) + 10;

  if (y > PAGE_HEIGHT - 40) { nextPage(); }

  doc.setFont(undefined, "bold");
  doc.setFontSize(FONT_SIZE_HEADING);
  doc.text("10. Liitteet", MARGIN, y);
  y += 8;
  doc.setFont(undefined, "normal");
  doc.text("Liite 1: Kohteen pohjakartta. Päivitä liitekartat aina, kun tilojen käyttö tai turvallisuusjärjestelyt muuttuvat.", MARGIN, y);

  doc.save(`Pelastussuunnitelma_${(formData.companyName || "Yritys").replace(/\s+/g, "_")}.pdf`);
}
