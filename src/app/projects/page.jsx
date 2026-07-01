import { useTranslation } from 'react-i18next';
import { Col, Row, Card } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

import { useMemo, useState, useEffect } from 'react';
import { useProject } from '../../services/db';

import { useMyProjectMembers } from '../../services/db';
import Breadcrumb from '../../layouts/Breadcrumb';
import DbError from '../../components/DbError';
import Spinner from '../../components/Spinner';
import ProjectCard from './ProjectCard';
import { LayoutContainer } from '../../layouts/Default';

function MyBreadcrumb() {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={t('Select project')}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item>{t('Projects')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

function NoProjects() {
  const { t } = useTranslation();
  return (
    <Row>
      <Card className="mb-4">
        <Card.Body className="d-flex justify-content-center align-items-center h-100">
          <div className="text-center">
            <h3 className="mb-4">
              <FaTimes />
            </h3>
            <h5 className="mb-4">{t('No projects')}</h5>
            <p>
              {t(
                'You are not a member of any project. Please contact a brother who is taking the lead in a cart project.',
              )}
            </p>
          </div>
        </Card.Body>
      </Card>
    </Row>
  );
}
//Topi sort by alphabets
function ProjectSorter({ projectId, onNameLoaded }) {
  const { data: project } = useProject(projectId);
  const name = project?.name;

  useEffect(() => {
    if (name) {
      onNameLoaded(projectId, name);
    }
  }, [name, projectId, onNameLoaded]);

  return null;
}

export default function Projects() {
  const { docs, error, isLoading, hasLoaded } = useMyProjectMembers();
  const [projectNames, setProjectNames] = useState({});
  const handleNameLoaded = useMemo(() => {
    return (id, name) => {
      setProjectNames((prev) => {
        if (prev[id] === name) return prev;
        return { ...prev, [id]: name };
      });
    };
  }, []);

  const sortedProjectIds = useMemo(() => {
    if (!docs) return [];

    return Object.keys(docs).sort((a, b) => {
      const nameA = projectNames[a] || a;
      const nameB = projectNames[b] || b;
      return nameA.localeCompare(nameB, 'fi', { sensitivity: 'base' });
    });
  }, [docs, projectNames]);

  return (
    <LayoutContainer breadcrumb={<MyBreadcrumb />}>
      <DbError error={error} />
      {hasLoaded && Object.keys(docs ?? {}).length === 0 ? (
        <NoProjects />
      ) : (
        <Row className="mh-14">
          {isLoading && (
            <div>
              <Spinner />
            </div>
          )}
          {Object.keys(docs ?? {}).map((id) => (
            <ProjectSorter
              key={id}
              projectId={id}
              onNameLoaded={handleNameLoaded}
            />
          ))}

          {sortedProjectIds.map((projectId) => (
            <Col md={4} key={projectId}>
              <ProjectCard projectId={projectId} />
            </Col>
          ))}
        </Row>
      )}
    </LayoutContainer>
  );
}
