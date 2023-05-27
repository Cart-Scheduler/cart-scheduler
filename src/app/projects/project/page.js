import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useProject, useSlots } from '../../../services/db';

export default function Project() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId);
  const { docs: slots, isLoading: slotsLoading } = useSlots(projectId);
  console.debug('project', project);
  console.debug('slots', slots, slotsLoading);
  const { t } = useTranslation();
  return (
    <div>
      <h2>Project</h2>
      <div>
        <Link to="/projects">{t('Back')}</Link>
      </div>
      {isLoading && <div>Loading...</div>}
      {project?.name}
    </div>
  );
}
