import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { generateEmergencyPlanPdf } from "../utils/generateEmergencyPlanPdf";
import { getDraft, saveDraft, updateDraft } from "../services/draftService";
import "./CreateNewDocument.css";

const INITIAL_FORM = {
  companyName: "",
  address: "",
  documentDate: "",
  authorName: "",
  approverName: "",
  nextReviewDate: "",
  businessId: "",
  propertyId: "",
  zoningMark: "",
  lotArea: "",
  buildYear: "",
  buildingType: "",
  heating: "",
  totalArea: "",
  premisesUse: "",
  ownerContact: "",
  safetyOfficer: "",
  deputyContact: "",
  extinguisherContact: "",
  firstAidContact: "",
  propertyMaintenance: "",
  electricityContact: "",
  tenantContacts: "",
  assemblyPoint: "",
  extinguishers: "",
  fireBlankets: "",
  firstAidKits: "",
  aedLocation: "",
  electricalShutoff: "",
  waterShutoff: "",
  ventilationShutoff: "",
};

export default function CreateNewDocument() {
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [generating, setGenerating] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftLoadError, setDraftLoadError] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!draftId || !user) return;
    let cancelled = false;
    setDraftLoadError(null);
    getDraft(draftId, user.uid)
      .then((draft) => {
        if (cancelled || !draft) return;
        const { id, updatedAt, createdAt, ...formFields } = draft;
        setForm((prev) => ({ ...INITIAL_FORM, ...formFields }));
      })
      .catch(() => {
        if (!cancelled) setDraftLoadError("Luonnosta ei löydy.");
      });
    return () => { cancelled = true; };
  }, [draftId, user]);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      generateEmergencyPlanPdf(form);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSavingDraft(true);
    try {
      if (draftId) {
        await updateDraft(draftId, user.uid, form);
        navigate("/dashboard/drafts", { replace: true });
      } else {
        await saveDraft(user.uid, form);
        navigate("/dashboard/drafts", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setDraftLoadError("Luonnoksen tallennus epäonnistui.");
    } finally {
      setSavingDraft(false);
    }
  };

  const isEditingDraft = Boolean(draftId);

  return (
    <div className="create-doc">
      <h1 className="create-doc-title">
        {isEditingDraft ? "Muokkaa luonnosta" : "Uusi pelastussuunnitelma"}
      </h1>
      {draftLoadError && (
        <p className="create-doc-error" role="alert">
          {draftLoadError}
        </p>
      )}
      <p className="create-doc-intro">
        Täytä kentät ja lataa PDF-dokumentti. Dokumentti vastaa Diggerman-tyyppistä pelastussuunnitelmaa.
      </p>

      <form onSubmit={handleSubmit} className="create-doc-form">
        <section className="create-doc-section">
          <h2>1. Dokumentinhallinta</h2>
          <div className="create-doc-grid">
            <label>Yritys / kohde</label>
            <input value={form.companyName} onChange={update("companyName")} placeholder="esim. Diggerman Oy" />
            <label>Osoite</label>
            <input value={form.address} onChange={update("address")} placeholder="esim. Haanpäänkatu 5, 38710 Kankaanpää" />
            <label>Päiväys</label>
            <input value={form.documentDate} onChange={update("documentDate")} placeholder="pp.kk.vvvv" />
            <label>Laatija (nimi / rooli)</label>
            <input value={form.authorName} onChange={update("authorName")} placeholder="Laatija" />
            <label>Hyväksyjä (nimi / rooli)</label>
            <input value={form.approverName} onChange={update("approverName")} placeholder="Hyväksyjä" />
            <label>Seuraava tarkistus</label>
            <input value={form.nextReviewDate} onChange={update("nextReviewDate")} placeholder="pp.kk.vvvv" />
          </div>
        </section>

        <section className="create-doc-section">
          <h2>2. Kohteen perustiedot</h2>
          <div className="create-doc-grid">
            <label>Y-tunnus</label>
            <input value={form.businessId} onChange={update("businessId")} placeholder="1234567-8" />
            <label>Kiinteistötunnus</label>
            <input value={form.propertyId} onChange={update("propertyId")} placeholder="214-3-213-3" />
            <label>Kaavamerkintä</label>
            <input value={form.zoningMark} onChange={update("zoningMark")} placeholder="esim. TTV2" />
            <label>Tontin pinta-ala</label>
            <input value={form.lotArea} onChange={update("lotArea")} placeholder="esim. 0,4864 ha" />
            <label>Rakennusvuosi / laajennukset</label>
            <input value={form.buildYear} onChange={update("buildYear")} placeholder="esim. 1965 / 1972, 1983" />
            <label>Rakennustyyppi</label>
            <input value={form.buildingType} onChange={update("buildingType")} placeholder="esim. Täystiilirakenne; harjakatto" />
            <label>Lämmitys</label>
            <input value={form.heating} onChange={update("heating")} placeholder="esim. Kaukolämpö" />
            <label>Kokonaispinta-ala</label>
            <input value={form.totalArea} onChange={update("totalArea")} placeholder="esim. 1159 m²" />
          </div>
        </section>

        <section className="create-doc-section">
          <h2>3. Tilojen käyttö ja käyttäjät</h2>
          <label>Kuvaile tilojen käyttö, vuokralaiset ja käyttäjät</label>
          <textarea
            value={form.premisesUse}
            onChange={update("premisesUse")}
            rows={6}
            placeholder="Vuokratut asunnot, hallit, varastot jne."
          />
        </section>

        <section className="create-doc-section">
          <h2>4. Turvallisuusorganisaatio</h2>
          <div className="create-doc-grid">
            <label>Omistajan edustaja / vastuuhenkilö</label>
            <input value={form.ownerContact} onChange={update("ownerContact")} placeholder="nimi, puhelin" />
            <label>Turvallisuusvastaava</label>
            <input value={form.safetyOfficer} onChange={update("safetyOfficer")} placeholder="nimi, puhelin" />
            <label>Varahenkilö</label>
            <input value={form.deputyContact} onChange={update("deputyContact")} placeholder="nimi, puhelin" />
            <label>Alkusammutusvastaava(t)</label>
            <input value={form.extinguisherContact} onChange={update("extinguisherContact")} placeholder="nimi(t), puhelin" />
            <label>Ensiapuvastaava(t)</label>
            <input value={form.firstAidContact} onChange={update("firstAidContact")} placeholder="nimi(t), puhelin" />
            <label>Kiinteistöhuolto</label>
            <input value={form.propertyMaintenance} onChange={update("propertyMaintenance")} placeholder="yritys, päivystysnumero" />
            <label>Sähkö-/LVI-huolto</label>
            <input value={form.electricityContact} onChange={update("electricityContact")} placeholder="yritys, numero" />
            <label>Vuokralaisten yhteyshenkilöt</label>
            <input value={form.tenantContacts} onChange={update("tenantContacts")} placeholder="nimi/tila, puhelin" />
          </div>
        </section>

        <section className="create-doc-section">
          <h2>6. Turvallisuusjärjestelyt</h2>
          <div className="create-doc-grid">
            <label>Kokoontumispaikka</label>
            <input value={form.assemblyPoint} onChange={update("assemblyPoint")} placeholder="pihan kokoontumispaikka" />
            <label>Käsisammuttimet</label>
            <input value={form.extinguishers} onChange={update("extinguishers")} placeholder="määrä/tyyppi/sijainnit" />
            <label>Sammutuspeitteet</label>
            <input value={form.fireBlankets} onChange={update("fireBlankets")} placeholder="sijainnit" />
            <label>Ensiapulaukut / kaapit</label>
            <input value={form.firstAidKits} onChange={update("firstAidKits")} placeholder="sijainnit" />
            <label>Defibrillaattori (AED)</label>
            <input value={form.aedLocation} onChange={update("aedLocation")} placeholder="sijainti tai -" />
            <label>Sähköpääkeskus</label>
            <input value={form.electricalShutoff} onChange={update("electricalShutoff")} placeholder="sijainti" />
            <label>Veden pääsulku</label>
            <input value={form.waterShutoff} onChange={update("waterShutoff")} placeholder="sijainti" />
            <label>Ilmanvaihdon hätäpysäytys</label>
            <input value={form.ventilationShutoff} onChange={update("ventilationShutoff")} placeholder="sijainti" />
          </div>
        </section>

        <div className="create-doc-actions">
          <button
            type="button"
            className="create-doc-draft"
            onClick={handleSaveDraft}
            disabled={savingDraft}
          >
            {savingDraft ? "Tallennetaan…" : isEditingDraft ? "Päivitä luonnos" : "Tallenna luonnos"}
          </button>
          <button type="submit" className="create-doc-submit" disabled={generating}>
            {generating ? "Luodaan PDF…" : "Lataa PDF"}
          </button>
        </div>
      </form>
    </div>
  );
}
