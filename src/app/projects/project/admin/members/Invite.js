import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useTranslation } from 'react-i18next';

const genInviteLink = (projectId) => {
  const { hostname, port, protocol } = window.location;
  let url = `${protocol}//${hostname}`;
  if (port) {
    url += ':' + port;
  }
  url += `/join/${projectId}`;
  return url;
};

function useCopyFlag() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  return [copied, setCopied];
}

export default function Invite({ projectId }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useCopyFlag();
  const link = genInviteLink(projectId);
  const copySupported = navigator?.clipboard?.writeText !== undefined;
  const copy = async () => {
    setCopied(true);
    await navigator.clipboard.writeText(link);
  };
  return (
    <Card className="mb-3">
      <Card.Header className="pb-1">
        <h6>{t('Invite link')}</h6>
      </Card.Header>
      <Card.Body className="pt-0 pb-4">
        <p className="mb-0">{t('Invite new members by sharing this link:')}</p>
        <InputGroup className="">
          <Form.Control value={link} disabled />
          {copySupported && (
            <Button
              variant="primary"
              id="copy-button"
              className="mb-0"
              onClick={copy}
            >
              {t('Copy')}
            </Button>
          )}
        </InputGroup>
        {copied && (
          <div className="text-muted text-sm">
            {t('Link copied to clipboard.')}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
