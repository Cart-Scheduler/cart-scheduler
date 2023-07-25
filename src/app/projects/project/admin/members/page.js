import { forwardRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { FaEllipsisV, FaUserAlt } from 'react-icons/fa';

import Breadcrumb from '../../../../../layouts/Breadcrumb';
import JoinRequestManager from './JoinRequestManager';
import { LayoutContainer } from '../../../../../layouts/Default';
import {
  removePersonsFromProject,
  updateProjectMembers,
  usePersonId,
  useProject,
  useProjectMembers,
} from '../../../../../services/db';
import { nameSorter } from '../../../../../services/string';
import Invite from './Invite';

function MyBreadcrumb({ projectId, project }) {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={`${t('Admin')}: ${project?.name}`}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item to="/projects">{t('Projects')}</Breadcrumb.Item>
      <Breadcrumb.Item to={`/projects/${projectId}`}>
        {project?.name}
      </Breadcrumb.Item>
      <Breadcrumb.Item to={`/projects/${projectId}/admin`}>
        {t('Admin')}
      </Breadcrumb.Item>
      <Breadcrumb.Item>{t('Members')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

const MemberMenuToggle = forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    className="btn btn-link text-secondary mb-0"
    onClick={onClick}
  >
    {children}
  </button>
));

function MemberMenu({ projectId, personId, member }) {
  const { t } = useTranslation();
  const handleRemove = async () => {
    try {
      await removePersonsFromProject(projectId, [personId]);
    } catch (err) {
      console.error(err);
    }
  };
  const setAdmin = async (isAdmin) => {
    try {
      const newMember = { ...member };
      if (isAdmin) {
        newMember.admin = true;
      } else {
        delete newMember.admin;
      }
      await updateProjectMembers(projectId, {
        [`members.${personId}`]: newMember,
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dropdown>
      <Dropdown.Toggle as={MemberMenuToggle} id={`member-${personId}-menu`}>
        <FaEllipsisV />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {member.admin ? (
          <Dropdown.Item as="button" onClick={() => setAdmin(false)}>
            {t('Dismiss as admin')}
          </Dropdown.Item>
        ) : (
          <Dropdown.Item as="button" onClick={() => setAdmin(true)}>
            {t('Make admin')}
          </Dropdown.Item>
        )}
        <Dropdown.Item as="button" onClick={handleRemove}>
          {t('Remove')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function Member({ projectId, personId, member, isCurrent }) {
  const { t } = useTranslation();
  return (
    <tr>
      <td>
        <div className="d-flex px-2">
          <div className="me-2">
            <FaUserAlt />
          </div>
          <div className="my-auto">
            <h6 className="mb-0 text-sm">{member.name}</h6>
          </div>
        </div>
      </td>
      <td className="align-middle text-center text-sm">
        {member.admin && (
          <span className="badge badge-sm bg-gradient-success">
            {t('ROLE.ADMIN')}
          </span>
        )}
      </td>
      <td className="align-middle text-end">
        {!isCurrent && (
          <MemberMenu
            projectId={projectId}
            personId={personId}
            member={member}
          />
        )}
      </td>
    </tr>
  );
}

function MemberList({ projectId }) {
  const { t } = useTranslation();
  const { data: project } = useProject(projectId);

  const currentPersonId = usePersonId();
  const membersDoc = useProjectMembers(projectId);

  const members = useMemo(
    () =>
      Object.entries(membersDoc?.members ?? {})
        .sort((a, b) => nameSorter(a[1].name, b[1].name))
        .sort((a, b) => !!b[1].admin - !!a[1].admin)
        .sort((a, b) => (a[0] === currentPersonId ? -1 : 1)),
    [membersDoc?.members, currentPersonId],
  );

  if (!membersDoc?.members || !project) {
    return null;
  }

  return (
    <Card className="mb-3">
      <Card.Header className="pb-1">
        <h6>
          {t('Members')} ({members.length})
        </h6>
      </Card.Header>
      <Card.Body className="px-0 pt-0 pb-2">
        <table className="table align-items-center justify-content-center mb-0">
          <tbody>
            {members.map(([personId, member]) => (
              <Member
                key={personId}
                projectId={projectId}
                personId={personId}
                member={member}
                isCurrent={personId === currentPersonId}
              />
            ))}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
}

export default function ProjectMembers() {
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  return (
    <LayoutContainer
      fluid
      breadcrumb={<MyBreadcrumb projectId={projectId} project={project} />}
    >
      <Row>
        <Col>
          <JoinRequestManager projectId={projectId} />
          <Invite projectId={projectId} />
          <MemberList projectId={projectId} />
        </Col>
      </Row>
    </LayoutContainer>
  );
}
