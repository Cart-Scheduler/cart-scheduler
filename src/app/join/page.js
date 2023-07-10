import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useMyProjectMembers } from '../../services/db';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { createJoinRq } from '../../services/functions';
import { useTranslation } from 'react-i18next';
import Alert from 'react-bootstrap/Alert';
import React, { useState, useEffect } from 'react';

import { FaPlus } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { LayoutContainer } from '../../layouts/Default';
import Breadcrumb from '../../layouts/Breadcrumb';
import Collapse from 'react-bootstrap/Collapse';

import { usePerson } from '../../services/db';

function MyBreadcrumb() {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={t('Join')}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item to="/projects">{t('Projects')}</Breadcrumb.Item>
      <Breadcrumb.Item>{t('Join')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default function JoinProject() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId);
  const { t } = useTranslation();
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState(null);
  const { docs: myProjects, isLoading: projectsIsLoading } =
    useMyProjectMembers();
  const navigate = useNavigate();
  const { data: person } = usePerson();

  useEffect(() => {
    if (
      !projectsIsLoading &&
      myProjects &&
      Object.keys(myProjects).includes(projectId)
    ) {
      navigate(`/projects/${projectId}`);
    }
  }, [myProjects, projectsIsLoading, navigate, projectId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleJoinProjectClick = async () => {
    try {
      await createJoinRq({ projectId });
      setRequestSent(true);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <LayoutContainer fluid breadcrumb={<MyBreadcrumb />}>
      <Row className="text-center">
        <Col sm={11} md={10} lg={9} className="mx-auto">
          <Card className="mb-6">
            {!person?.name ? (
              <div className="px-4 mt-4">
                <p className="small mb-3">
                  {t('Please update your name to be able to join the project.')}
                </p>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => navigate('/profile')}
                  className="mb-4"
                >
                  {t('Update profile')}
                </Button>
              </div>
            ) : (
              <Card.Body className="d-flex justify-content-center align-items-center h-100">
                <div className="text-center w-100">
                  <div className="mb-4">
                    <Collapse in={!requestSent}>
                      <FaPlus />
                    </Collapse>
                    <Collapse in={requestSent}>
                      <FaCheck />
                    </Collapse>
                  </div>
                  <h5 className="mb-4">{project?.name}</h5>
                  {error && (
                    <Alert variant="danger" className="my-2 text-white">
                      {t('Failed to join project')}
                    </Alert>
                  )}
                  {requestSent && (
                    <p className="small muted my-2">
                      {t(
                        'Thank you! Please wait until your request is processed. If accepted, the project will appear.',
                      )}
                    </p>
                  )}
                  <Collapse in={!requestSent}>
                    <div className="my-2">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleJoinProjectClick}
                      >
                        {t('Send Request')}
                      </Button>
                    </div>
                  </Collapse>
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}
