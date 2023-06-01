import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { useMyProjectMembers, useProject } from '../../services/db';
import { LayoutContainer } from '../../layouts/Default';
import Breadcrumb from '../../layouts/Breadcrumb';
import Spinner from '../../components/Spinner';
import CreateProjectModal from './CreateProjectModal';

function ProjectCard({ projectId }) {
  const { data: project } = useProject(projectId);
  return (
    <div>
      <Link to={`/projects/${projectId}`}>
        {projectId} - {project?.name}
      </Link>
    </div>
  );
}

function MyBreadcrumb() {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={t('Projects')}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item>{t('Projects')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default function Projects() {
  const { t } = useTranslation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { docs, isLoading } = useMyProjectMembers();
  return (
    <LayoutContainer breadcrumb={<MyBreadcrumb />}>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <h2>Projects</h2>
              {isLoading && (
                <div>
                  <Spinner />
                </div>
              )}
              {Object.keys(docs).map((projectId) => (
                <ProjectCard key={projectId} projectId={projectId} />
              ))}
              <Button onClick={() => setShowCreateModal(true)}>
                {t('Create project')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <CreateProjectModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </LayoutContainer>
  );
}
