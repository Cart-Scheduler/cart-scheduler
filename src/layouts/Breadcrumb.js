import React from 'react';
import { Link } from 'react-router-dom';

function Item({ to, children }) {
  return (
    <li className="breadcrumb-item text-sm">
      {to ? <Link to={to}>{children}</Link> : children}
    </li>
  );
}

function Breadcrumb({ children, title, theme }) {
  const mainClass = `breadcrumb-theme-${theme === 'light' ? 'light' : 'dark'}`;
  return (
    <nav aria-label="breadcrumb" className={mainClass}>
      <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
        {children}
      </ol>
      <h6 className="font-weight-bolder mb-0">{title}</h6>
    </nav>
  );
}
Breadcrumb.Item = Item;

export default Breadcrumb;
