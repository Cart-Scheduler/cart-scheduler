import { Link, useParams } from 'react-router-dom';

import { useProject } from '../../../services/db';

export default function Project() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId);
  return (
    <div>
      <h2>Project</h2>
      <div>
        <Link to="/projects">Back</Link>
      </div>
      {isLoading && <div>Loading...</div>}
      {project?.name}
    </div>
  );
}
