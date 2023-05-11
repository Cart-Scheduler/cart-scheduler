import React from 'react';
import classNames from 'classnames';

const Spinner = (props) => {
  const children = props.children ?? null;
  const Tag = props.tag ?? 'div';
  const color = props.color ?? 'secondary';
  const size = props.size ?? '';
  const type = props.type ?? 'bordered';

  return (
    <Tag
      role="status"
      className={classNames(
        {
          'spinner-border': type === 'bordered',
          'spinner-grow': type === 'grow',
        },
        [`text-${color}`],
        { [`avatar-${size}`]: size },
        props.className,
      )}
    >
      {children}
    </Tag>
  );
};

export default Spinner;
