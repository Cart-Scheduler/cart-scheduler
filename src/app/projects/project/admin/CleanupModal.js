/* eslint-disable prettier/prettier */
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

// HUOM: updateProject korvataan myöhemmin sinun omalla cleanup-funktiolla
// Tässä esimerkissä poistetaan turha importti, koska emme käytä sitä vielä
// import { updateProject } from '../../../../services/db'; 

// Otetaan samat propsit kuin EditProjectModal, vaikka emme käytä niitä kaikkia heti.
export default function CleanupModal({ show, onHide, projectId }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState();
  // Tähän voit lisätä tiloja, jos tarvitset esim. valintalaatikoita siivouksen tyypeille
  // const [cleanupOption, setCleanupOption] = useState('old-data'); 
  
  const { t } = useTranslation();

  // HUOM: Ei tarvita useEffect-hookia, koska emme lataa olemassa olevaa dataa.

  const cleanup = async () => {
    // ESTÄÄ TOISTUVAN PAINAMISEN JA NÄYTTÄÄ LATAUSTILAN
    setSaving(true);
    setError();
    
    // ------------------------------------------------------------------
    // TÄHÄN TULEE TULEVA FIREBASE/FIRESTORE SIIVOUSLOGIIKKA
    // Esim: await cleanupProjectData(projectId);
    
    // Tällä hetkellä odotetaan vain hetki, jotta näet "saving"-tilan
    await new Promise(resolve => setTimeout(resolve, 1000));
    // ------------------------------------------------------------------

    try {
      // Kun valmis
      onHide();
    } catch (err) {
      console.error(err);
      // Jos virhe
      setError(err.message);
    }
    setSaving(false);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    cleanup();
  };

  return (
    // HUOM: show ja onHide propseilla ohjataan modaalin näkyvyyttä
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        {/* Käytä Cleanup-otsikkoa */}
        <Modal.Title>{t('Cleanup')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Tähän voit lisätä kenttiä tai selityksen siivouksesta */}
          <p>{t('Press "Run Cleanup" to execute the project data cleanup task.')}</p>

          {/* Esimerkki valintakentästä tulevaisuutta varten: */}
          {/*
          <Form.Group className="mb-3">
             <Form.Label>{t('Cleanup type')}</Form.Label>
             <Form.Select 
                value={cleanupOption} 
                onChange={(e) => setCleanupOption(e.target.value)}
             >
                <option value="old-data">Poista vanhat tiedot</option>
             </Form.Select>
          </Form.Group>
          */}

          {error && <Alert variant="danger">{t(error)}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          {/* Nappi on disabled (ei voi painaa) "saving"-tilan aikana */}
          <Button variant="danger" type="submit" disabled={saving}>
            {t('Run Cleanup')} {/* Tai 'Cleanup' */}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}