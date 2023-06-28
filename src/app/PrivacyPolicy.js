import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import { LayoutContainer } from '../layouts/Default';
import Breadcrumb from '../layouts/Breadcrumb';

function MyBreadcrumb() {
  const { t } = useTranslation();
  return <Breadcrumb title={t('Privacy Policy')}></Breadcrumb>;
}

function PrivacyPolicyContent() {
  return (
    <div className="p-4">
      <h3 className="mb-3">Tietosuojakäytäntö</h3>
      <div className="p-2">
        <p className="p-1 mb-4">
          Tervetuloa {process.env.REACT_APP_TITLE} -sivustolle. Me kunnioitamme
          yksityisyyttäsi ja pyrimme suojelemaan henkilötietojasi. <br></br>{' '}
          Tässä tietosuojakäytännössä kerromme, miten keräämme, käytämme ja
          suojaamme henkilötietojasi Euroopan Unionin <br></br> yleisen
          tietosuoja-asetuksen (GDPR) mukaisesti.
        </p>
        <p className="p-1 fw-bold mb-0">GDPR ja henkilötietojen käsittely</p>
        <p className="p-1 mb-3">
          GDPR on Euroopan Unionin asetus, joka suojaa yksilöiden henkilötietoja
          ja yksityisyyttä. Sen tarkoitus on yhtenäistää ja vahvistaa
          tietosuojaa koko EU:n alueella.
          <br></br>
          Käsittelemme henkilötietojasi ainoastaan laillisten perusteiden
          mukaisesti, kuten suostumuksesi perusteella, sopimuksen
          täytäntöönpanoa varten tai oikeutetun etumme perusteella. Tietojen
          käsittely on rajoitettu ainoastaan välttämättömään ja henkilötietoja
          säilytetään ainoastaan niin kauan kuin on tarpeellista.
        </p>

        <p className="p-1 fw-bold mb-0">
          Tietojen kerääminen ja käyttö sekä kolmannen osapuolen palvelut
        </p>
        <p className="p-1 mb-3">
          Keräämme ja käytämme tietojasi palvelumme parantamiseen ja
          personoimiseen. Tämä sisältää tiedot, kuten nimen, sukunimen,
          sähköpostiosoitteen ja sukupuolen. Käytämme tätä tietoa yhteydenpitoon
          ja käyttäjäkokemuksen parantamiseen. Lisäksi käyttämämme teknologia,
          kuten{' '}
          <a
            href="https://firebase.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Firebase
          </a>
          , saattavaa kerätä teknisiä tietoja, kuten IP-osoitteen tai
          laitetiedot, tarpeen mukaan. Nämä tiedot käytetään ainoastaan palvelun
          tarjoamiseen ja sen toiminnan parantamiseen.
        </p>
        <p className="p-1 fw-bold mb-0">Evästeet</p>
        <p className="p-1 mb-3">
          Käytämme evästeitä parantaaksemme ja personoimaan käyttökokemusta.
          Evästeet ovat pieniä tiedostoja, jotka tallennetaan tietokoneellesi
          tai laitteellesi ja jotka auttavat meitä ymmärtämään, miten käytät
          sivustoamme. Voit hallita evästeiden käyttöä selaimesi asetuksista.
        </p>
        <p className="p-1 fw-bold mb-0">Turvallisuus</p>
        <p className="p-1 mb-3">
          Henkilötietojesi turvallisuus on meille tärkeää. Käytämme alan
          standardien mukaisia ​​turvallisuusmenetelmiä tietojen suojaamiseksi.
          Huomaathan kuitenkin, että mikään menetelmä ei ole 100% turvallinen.
        </p>
        <p className="p-1 fw-bold mb-0">Lasten yksityisyys</p>
        <p className="p-1 mb-3">
          Palvelumme ei ole tarkoitettu alle 13-vuotiaille. Emme tietoisesti
          kerää henkilötietoja alle 13-vuotiailta. Jos olet vanhempi tai
          huoltaja ja tiedät, että lapsesi on antanut meille henkilötietoja, ota
          meihin yhteyttä, jotta voimme tehdä tarvittavat toimenpiteet.
        </p>
        <p className="p-1 fw-bold mb-0">Muutokset tietosuojakäytäntöön</p>
        <p className="p-1 mb-3">
          Voimme päivittää tätä tietosuojakäytäntöä tarpeen mukaan, joten
          kehotamme sinua tarkistamaan sitä säännöllisesti. Muutokset tulevat
          voimaan, kun ne on julkaistu tällä sivulla.
        </p>
        <p className="p-1 fw-bold mb-0">Yhteystiedot</p>
        <p className="p-1 mb-3">
          Jos sinulla on kysyttävää tietosuojakäytännöstä tai jos haluat tehdä
          pyynnön tietojesi tarkastamiseksi, korjaamiseksi tai poistamiseksi,
          voit ottaa meihin yhteyttä sähköpostitse:{' '}
          {process.env.REACT_APP_CONTACT_EMAIL}
        </p>
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <LayoutContainer breadcrumb={<MyBreadcrumb />}>
      <Row>
        <Col>
          <Card className="mb-4" style={{ minHeight: '20em' }}>
            <Card.Body>
              <PrivacyPolicyContent />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}
