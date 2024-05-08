import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle } from 'react-icons/fa';

import Breadcrumb from '../../layouts/Breadcrumb';
import { LayoutContainer } from '../../layouts/Default';
import MySpinner from '../../components/Spinner';
import { createJoinRq } from '../../services/functions';
import { usePerson, useProject, useMyProjectMembers } from '../../services/db';

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

function Container({ children }) {
  return (
    <LayoutContainer fluid breadcrumb={<MyBreadcrumb />}>
      <Row className="text-center">
        <Col sm={11} md={10} lg={9} className="mx-auto">
          <Card className="mb-6">
            <Card.Body className="d-flex justify-content-center align-items-center h-100 mh-10">
              {children}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
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
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
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

  if (isLoading || person === undefined) {
    return (
      <Container>
        <div className="px-4 my-4">
          <MySpinner />
        </div>
      </Container>
    );
  }

  const handleJoinProjectClick = async () => {
    setIsLoadingRequest(true);
    try {
      await createJoinRq({ projectId });
      setRequestSent(true);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  if (!person?.name) {
    return (
      <Container>
        <div className="px-4 mt-4">
          <p className="small mb-3">
            {t('Please update your name to be able to join the project.')}
          </p>
          <Button
            variant="primary"
            size="small"
            onClick={() =>
              navigate('/profile', {
                state: { from: `/join/${projectId}` },
              })
            }
            className="mb-4"
          >
            {t('Update profile')}
          </Button>
        </div>
      </Container>
    );
  }

  if (!isLoading && project !== undefined && !project.created) {
    return (
      <Container>
        <div className="">
          <div className="my-4">
            <FaExclamationCircle size={64} />
          </div>
          <strong>{t('Project not found.')}</strong>
          <br />
          <p>{t('Check that the link is ok.')}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="text-center w-100">
        <h5 className="mt-3 mb-4">{project?.name}</h5>
        {error && (
          <Alert variant="danger" className="my-2 text-white">
            {t('Failed to join project')}
          </Alert>
        )}
        {requestSent ? (
          <p className="small muted my-3">
            {t(
              'Thank you! Please wait until your request is processed. If accepted, the project will appear.',
            )}
          </p>
        ) : (
          <div className="my-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleJoinProjectClick}
              disabled={isLoadingRequest}
            >
              {isLoadingRequest ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">{t('Loading...')}</span>
                </>
              ) : (
                t('Send Request')
              )}
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
