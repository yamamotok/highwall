import classNames from 'classnames';
import React, { Fragment } from 'react';

import './Hud.css';

interface Props {
  position: string;
  values?: Record<string, string | number | undefined>;
}

/**
 * Head-up Display for debugging, which shows given key-value pairs.
 */
export const Hud: React.FC<Props> = (props) => {
  const values = props.values || {};
  return (
    <dl data-testid="highwall-hud" className={classNames('Hud', props.position)}>
      {Object.entries(values).map(([k, v], index) => (
        <Fragment key={index}>
          <dt>{k}</dt>
          <dd key={index}>{v === undefined ? 'undefined' : v}</dd>
        </Fragment>
      ))}
    </dl>
  );
};
