import { useParams } from 'react-router-dom';

import { useProject } from '../../services/db';

export default function JoinProject() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>Join project: {project?.name}</div>;
}
