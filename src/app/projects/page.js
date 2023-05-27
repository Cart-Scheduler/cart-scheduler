import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import { useMyProjectMembers, useProject } from '../../services/db';
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

export default function Projects() {
  const { t } = useTranslation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { docs, isLoading } = useMyProjectMembers();
  return (
    <div>
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
      <CreateProjectModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </div>
  );
}
