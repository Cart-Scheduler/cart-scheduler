import { useTranslation } from 'react-i18next';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FaTimes } from 'react-icons/fa';

import { useMyProjectMembers } from '../../services/db';
import { LayoutContainer } from '../../layouts/Default';
import Breadcrumb from '../../layouts/Breadcrumb';
import DbError from '../../components/DbError';
import Spinner from '../../components/Spinner';
import ProjectCard from './ProjectCard';

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

export default function Projects() {
  const { docs, error, isLoading, hasLoaded } = useMyProjectMembers();
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
          {Object.keys(docs).map((projectId) => (
            <Col md={4} key={projectId}>
              <ProjectCard projectId={projectId} />
            </Col>
          ))}
        </Row>
      )}
    </LayoutContainer>
  );
}
