import { useTranslation } from 'react-i18next';
import { Col, Row, Card } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

import { useMyProjectMembers, useMySlots } from '../../services/db';
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

function ProjectAssignmentInfo({ projectId, allAssignments }) {
  const { t } = useTranslation();
  const currentTimestamp = new Date().getTime();

  if (!allAssignments) return null;

  const hasAssignments = Object.entries(allAssignments).some(
    ([id, doc]) =>
      doc?.projectId === projectId && doc?.ends >= currentTimestamp,
  );

  if (!hasAssignments) return null;

  return (
    <div className="text-xs text-success fw-bold px-2 py-1 position-absolute project-badge-vuoro">
      {t('Assignment')}
    </div>
  );
}

export default function Projects() {
  const { docs, error, isLoading, hasLoaded } = useMyProjectMembers();

  const myPersonId = (() => {
    if (!docs) return undefined;
    for (const project of Object.values(docs)) {
      const keys = Object.keys(project?.members ?? {});
      if (keys.length > 0) return keys[0];
    }
    return undefined;
  })();

  const { docs: allAssignments } = useMySlots(myPersonId);

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
          {Object.keys(docs ?? {}).map((projectId) => (
            <Col md={4} key={projectId} className="mb-4 position-relative">
              <ProjectAssignmentInfo
                projectId={projectId}
                allAssignments={allAssignments}
              />
              <ProjectCard projectId={projectId} />
            </Col>
          ))}
        </Row>
      )}
    </LayoutContainer>
  );
}
