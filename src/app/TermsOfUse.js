import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import { LayoutContainer } from '../layouts/Default';
import Breadcrumb from '../layouts/Breadcrumb';
import { Link } from 'react-router-dom';

function MyBreadcrumb() {
  const { t } = useTranslation();
  return (
    <Breadcrumb theme="light">
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item>{t('Terms of Use')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

function TermsOfUseContent() {
  return (
    <div className="p-1">
      <h3 className="mb-3">Käyttöehdot</h3>
      <div className="p-2">
        <p className="p-1 mb-4">
          Hyväksymällä nämä käyttöehdot hyväksyt samalla{' '}
          <a
            href="https://firebase.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firebase
          </a>
          -palvelun käyttöehdot, sekä sitoudut noudattamaan niitä käyttäessäsi
          webappiamme. Huomaa, että Firebase-palvelun ehdot voivat muuttua
          tulevaisuudessa, joten sitoudut myös seuraamaan ja noudattamaan näitä
          muutoksia. Nämä ehdot koskevat kaikkia {process.env.REACT_APP_TITLE}{' '}
          käyttäjiä, olivatpa he rekisteröityneitä käyttäjiä tai vierailijoita.{' '}
          {process.env.REACT_APP_TITLE} on työkalu projektin työvuorojen
          hallinnointiin. <br></br> <br></br>
          Jotta voit käyttää {process.env.REACT_APP_TITLE}:tä, sinun on
          rekisteröidyttävä. Rekisteröityessäsi sinun on annettava kokonimesi ja
          voimassa oleva sähköpostiosoitteesi. Sinä olet vastuussa kaikista{' '}
          {process.env.REACT_APP_TITLE} käyttäjätunnuksella ja salasanalla
          tehdystä toiminnasta. Pidätämme oikeuden keskeyttää tai lopettaa
          käyttäjätunnuksesi, jos havaitsemme, että olet antanut vääriä tai
          harhaanjohtavia tietoja. Palvelu tarjotaan "sellaisena kuin se on".
          Emme takaa Palvelun keskeytymättömyyttä tai virheettömyyttä.
        </p>
        <p className="p-1 mb-3">
          Sitoudut käyttämään palvelua vain laillisiin tarkoituksiin, hyvää
          tapaa noudattaen ja toisten käyttäjien oikeuksia ja etuja
          kunnioittaen. Noudatamme kaikessa toiminnassamme voimassa olevaa
          tietosuojalainsäädäntöä.{' '}
          <Link to="/privacy-policy">Tietosuojaselosteemme</Link> on saatavilla{' '}
          {process.env.REACT_APP_TITLE} sivulla ja se kertoo
          yksityiskohtaisesti, miten käsittelemme ja suojaamme henkilötietojasi.
          Olet yksin vastuussa kaikesta tähän webappiin lataamastasi sisällöstä
          ja sen seurauksista. Vakuutat ja takaat, että sinulla on kaikki
          tarvittavat lisenssit, oikeudet, suostumukset ja luvat sisällön
          lähettämiseen ja esittämiseen {process.env.REACT_APP_TITLE}:ssä.
          Pidätämme oikeuden poistaa minkä tahansa sisällön, joka rikkoo näitä
          käyttöehtoja tai jonka katsomme sopimattomaksi.
        </p>

        <p className="p-1 fw-bold mb-0">
          Palvelun Muuttaminen tai Lopettaminen
        </p>
        <p className="p-1 mb-3">
          Pidätämme oikeuden muuttaa tai lopettaa {process.env.REACT_APP_TITLE}
          :n tai sen osan milloin tahansa ilman etukäteisilmoitusta. Emme ole
          vastuussa sinulle tai kolmannelle osapuolelle, jos{' '}
          {process.env.REACT_APP_TITLE} lopetetaan. Teemme parhaamme
          ilmoittaaksemme mahdollisista muutoksista tai lopettamisista
          etukäteen, jos se on mahdollista.
        </p>
        <p className="p-1 fw-bold mb-0">Yhteystiedot</p>
        <p className="p-1 mb-3">
          Jos sinulla on kysyttävää käyttöehdoista, ota yhteyttä:{' '}
          {process.env.REACT_APP_CONTACT_EMAIL}
        </p>
      </div>
    </div>
  );
}

export default function TermsOfUse() {
  return (
    <LayoutContainer breadcrumb={<MyBreadcrumb />}>
      <Row>
        <Col>
          <Card className="mb-4" style={{ minHeight: '20em' }}>
            <Card.Body>
              <TermsOfUseContent />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}
