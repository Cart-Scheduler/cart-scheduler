import { useId, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';

export default function NameMissing() {
  const id = useId();
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div>
      <Form.Text
        muted
        onClick={() => setShowHelp(!showHelp)}
        className="text-decoration-underline cursor-pointer dropdown-toggle"
      >
        {t("Can't find the name?")}
      </Form.Text>
      <Collapse in={showHelp}>
        <div id={id} className="mt-2">
          {t('Make sure that your partner...')}
          <ol>
            <li>{t('has signed into this website')}</li>
            <li>{t('has entered his real full name')}</li>
            <li>{t('is accepted member of this project')}</li>
          </ol>
        </div>
      </Collapse>
    </div>
  );
}
