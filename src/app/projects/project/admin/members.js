import { useNavigate, useParams } from 'react-router-dom';
import { useProject, useProjectMembers } from '../../../../services/db';
import { Button, ListGroup, Form, Modal } from 'react-bootstrap';
import { useState } from 'react';
import Breadcrumb from '../../../../layouts/Breadcrumb';
import { LayoutContainer } from '../../../../layouts/Default';
import { Card } from 'react-bootstrap';
import { nameSorter } from '../../../../services/string';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import {
  useJoinRequests,
  addPersonToProject,
  deleteJoinRequest,
} from '../../../../services/db';

import {
  deleteField,
  doc,
  getFirestore,
  updateDoc as updateDocFirestore,
} from 'firebase/firestore';

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

function JoinRequest({ projectId, id, joinRequest }) {
  const { t } = useTranslation();
  const grant = async () => {
    try {
      await addPersonToProject(
        projectId,
        joinRequest.personId,
        joinRequest.name,
      );
      await deleteJoinRequest(id);
    } catch (err) {
      console.error(err);
    }
  };
  const deny = async () => {
    try {
      await deleteJoinRequest(id);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <li className="list-group-item border-0 d-flex justify-content-between">
      <div>{joinRequest.name}</div>
      <div>
        <Button variant="success" className="me-3" onClick={grant}>
          {t('Grant')}
        </Button>
        <Button variant="danger" onClick={deny}>
          {t('Deny')}
        </Button>
      </div>
    </li>
  );
}

export default function ProjectAdminMembers() {
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  const navigate = useNavigate();

  const membersDoc = useProjectMembers(projectId);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();
  const joinRequestDocs = useJoinRequests(projectId);
  const joinRequests = joinRequestDocs?.docs
    ? Object.entries(joinRequestDocs.docs)
    : [];
  joinRequests.sort((a, b) => a[1].created - b[1].created);
  const handleMemberToggle = (memberId) => {
    setSelectedMembers((prevState) => ({
      ...prevState,
      [memberId]: !prevState[memberId],
    }));
  };

  const handleRemoveSelected = async () => {
    const db = getFirestore();
    const docRef = doc(db, 'projectMembers', projectId);

    let updateData = {};
    for (let memberId in selectedMembers) {
      if (selectedMembers[memberId]) {
        updateData[`members.${memberId}`] = deleteField();
      }
    }

    try {
      await updateDocFirestore(docRef, updateData);
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
          {joinRequests.length > 0 && (
            <Card className="mb-3">
              <Card.Header>
                <h6>
                  {t('Join requests')} ({joinRequests.length})
                </h6>
              </Card.Header>
              <Card.Body>
                <ul className="list-group">
                  {joinRequests.map(([id, doc]) => (
                    <JoinRequest
                      key={id}
                      projectId={projectId}
                      id={id}
                      joinRequest={doc}
                    />
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}

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
                <Button variant="primary" onClick={() => navigate(-1)}>
                  {t('Back')}
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
