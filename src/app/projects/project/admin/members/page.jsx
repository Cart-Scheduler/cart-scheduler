import { forwardRef, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaEllipsisV, FaUserAlt } from 'react-icons/fa';

import Breadcrumb from '../../../../../layouts/Breadcrumb';
import JoinRequestManager from './JoinRequestManager';
import {
  removePersonsFromProject,
  updateProjectMembers,
  usePersonId,
  useProject,
  useProjectMembers,
} from '../../../../../services/db';
import { nameSorter } from '../../../../../services/string';
import Invite from './Invite';
import PersonDetailsModal from './PersonDetailsModal';
import { LayoutContainer } from '../../../../../layouts/Default';

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
MemberMenuToggle.displayName = 'MemberMenuToggle';

function MemberMenu({ projectId, personId, member, onDetails }) {
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
    //Topi fix to members being responsive
    <Dropdown align="end">
      <Dropdown.Toggle as={MemberMenuToggle} id={`member-${personId}-menu`}>
        <FaEllipsisV />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as="button" onClick={onDetails}>
          {t('Details')}
        </Dropdown.Item>
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

function Member({ projectId, personId, member, isCurrent, onDetails }) {
  const { t } = useTranslation();
  return (
    <Row className="align-items-center py-2 px-3 border-bottom mx-0 flex-nowrap">
      <Col className="d-flex align-items-center px-0 flex-grow-1 min-vw-0">
        <div className="me-2 text-secondary flex-shrink-0">
          <FaUserAlt />
        </div>
        <div className="d-flex flex-column min-vw-0 align-items-start">
          <h6 className="mb-0 text-sm text-truncate w-100">{member.name}</h6>
          {member.admin && (
            <span className="badge badge-sm bg-gradient-success text-xxs mt-1">
              {t('ROLE.ADMIN')}
            </span>
          )}
        </div>
      </Col>
      <Col xs="auto" className="text-end px-0 flex-shrink-0">
        {!isCurrent && (
          <MemberMenu
            projectId={projectId}
            personId={personId}
            member={member}
            onDetails={onDetails}
          />
        )}
      </Col>
    </Row>
  );
}

function MemberList({ projectId }) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState();
  const { data: project } = useProject(projectId);

  const currentPersonId = usePersonId();
  const membersDoc = useProjectMembers(projectId);

  const members = useMemo(
    () =>
      Object.entries(membersDoc?.members ?? {})
        .sort((a, b) => nameSorter(a[1].name, b[1].name))
        .sort((a, b) => (a[1].admin ? -1 : 0))
        .sort((a, b) => (a[0] === currentPersonId ? -1 : 0)),
    [membersDoc?.members, currentPersonId],
  );

  if (!membersDoc?.members || !project) {
    return null;
  }

  return (
    <Card className="mb-3">
      <Card.Header className="pb-2">
        <h6 className="mb-0">
          {t('Members')} ({members.length})
        </h6>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="d-flex flex-column">
          {members.map(([personId, member]) => (
            <Member
              key={personId}
              projectId={projectId}
              personId={personId}
              member={member}
              isCurrent={personId === currentPersonId}
              onDetails={() => {
                setSelectedPersonId(personId);
                setShowDetails(true);
              }}
            />
          ))}
        </div>
      </Card.Body>
      <PersonDetailsModal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        projectId={projectId}
        personId={selectedPersonId}
      />
    </Card>
  );
}

export default function ProjectMembers() {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { data: project } = useProject(projectId);
  return (
    <LayoutContainer
      fluid
      breadcrumb={<MyBreadcrumb projectId={projectId} project={project} />}
    >
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className="pb-0">
              <h6 className="mb-0">{t('Members')}</h6>
            </Card.Header>
            <Card.Body>
              <JoinRequestManager projectId={projectId} />
              <Invite projectId={projectId} />
              <MemberList projectId={projectId} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}
