import DashboardLayout from "../components/DashboardLayout";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="dashboard-intro-wrapper">
        <h1 className="dashboard-intro-title">Tervetuloa pelastussuunnitelma sovellukseen</h1>
        <section className="dashboard-intro">
          <p>
            Tämän sovelluksen avulla luot, hallitset ja päivität kiinteistösi 
            pelastussuunnitelmaa yhdessä paikassa. Tavoitteena on helpottaa riskien 
            tunnistamista, tukea ennaltaehkäisevää turvallisuustyötä ja varmistaa, että olennaiset
            tiedot ovat nopeasti löydettävissä henkilöille, jotka niitä tarvitsevat.
          </p>
          <p>
            Aloita uuden suunnitelman luomisella tai jatka aiemmin tallennettujen
            luonnosten parissa. Voit käyttää sivupalkkia siirtymiseen milloin
            tahansa.
          </p>

          <div className="dashboard-intro-cta-group">
            <Link to="/dashboard/plans" className="dashboard-intro-cta dashboard-intro-cta--primary">
              Luo uusi pelastussuunnitelma
            </Link>
            <Link to="/dashboard/drafts" className="dashboard-intro-cta dashboard-intro-cta--secondary">
              Avaa luonnokset
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
