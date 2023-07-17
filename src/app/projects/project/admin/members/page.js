import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ListGroup, Form, Modal } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../../../layouts/Breadcrumb';
import JoinRequestManager from './JoinRequestManager';
import { LayoutContainer } from '../../../../../layouts/Default';
import {
  removePersonsFromProject,
  useProject,
  useProjectMembers,
} from '../../../../../services/db';
import { nameSorter } from '../../../../../services/string';

function MyBreadcrumb({ projectId, project }) {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={`${t('Admin')}: ${project?.name}`}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item to="/projects">{t('Projects')}</Breadcrumb.Item>
      <Breadcrumb.Item to={`/projects/${projectId}`}>
        {project?.name}
      </Breadcrumb.Item>
      <Breadcrumb.Item>{t('Admin')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default function ProjectAdminMembers() {
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);

  const membersDoc = useProjectMembers(projectId);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();
  const handleMemberToggle = (memberId) => {
    setSelectedMembers((prevState) => ({
      ...prevState,
      [memberId]: !prevState[memberId],
    }));
  };

  const handleRemoveSelected = async () => {
    const personIds = Object.keys(selectedMembers).filter(
      (id) => selectedMembers[id],
    );
    console.debug('personIds', personIds);
    try {
      await removePersonsFromProject(projectId, personIds);
      setSelectedMembers({});
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update project members:', error);
    }
  };

  if (!membersDoc?.members || !project) {
    return null;
  }

  const isButtonDisabled = Object.values(selectedMembers).every((val) => !val);

  return (
    <LayoutContainer
      fluid
      breadcrumb={<MyBreadcrumb projectId={projectId} project={project} />}
    >
      <Row>
        <Col>
          <JoinRequestManager projectId={projectId} />
          <Card className="mb-3">
            <Card.Header>
              <h6>{project?.name}</h6>
            </Card.Header>
            <Card.Body>
              <ListGroup className="mb-3">
                {Object.entries(membersDoc.members)
                  .sort((a, b) => nameSorter(a[1].name, b[1].name))
                  .map(([memberId, memberData]) => (
                    <ListGroup.Item key={memberId}>
                      <Form.Check
                        type="checkbox"
                        id={`member-${memberId}`}
                        label={memberData.name}
                        checked={!!selectedMembers[memberId]}
                        onChange={() => handleMemberToggle(memberId)}
                      />
                    </ListGroup.Item>
                  ))}
              </ListGroup>

              <Modal.Footer>
                <Button
                  variant="danger"
                  onClick={() => setShowModal(true)}
                  disabled={isButtonDisabled}
                  className="me-2"
                >
                  {t('Remove')}
                </Button>
              </Modal.Footer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('Confirmation')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t(
            'Are you sure you want to remove selected user(s) from the project?',
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleRemoveSelected}>
            {t('Remove')}
          </Button>
          <Button variant="outline-primary" onClick={() => setShowModal(false)}>
            {t('Cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
    </LayoutContainer>
  );
}
