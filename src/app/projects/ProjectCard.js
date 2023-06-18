import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import { useProject } from '../../services/db';

export default function ProjectCard({ projectId }) {
  const { data: project } = useProject(projectId);
  const navigate = useNavigate();
  return (
    <Card
      className="card-project cursor-pointer mh-10 mb-4 p-3"
      onClick={() => navigate(`/projects/${projectId}`)}
    >
      <h5>{project?.name}</h5>
      <p className="text-sm text-muted">{projectId}</p>
    </Card>
  );
}
