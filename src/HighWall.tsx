import classNames from 'classnames';
import React, { CSSProperties, useEffect, useState } from 'react';

import './HighWall.css';
import { Hud } from './Hud';

/**
 * Function which can override measured height installation.
 * @param viewportHeight - manipulated viewport's height
 * @return style which will override given style in component's props.
 */
export type Fitter = (viewportHeight: number) => CSSProperties;

/**
 * As default, CSS `height` property is used.
 * In case `min-height` is more suitable, a customized style creator should be given as a component's prop.
 */
const defaultFitter: Fitter = (viewportHeight) => ({ height: viewportHeight });

/**
 * Debug HUD positions, leftTop is default.
 */
export enum HudPosition {
  leftTop = 'leftTop',
  leftBottom = 'leftBottom',
  rightTop = 'rightTop',
  rightBottom = 'rightBottom',
}

/**
 * HighWall props.
 */
interface HighWallProps {
  /**
   * Class names which will be added to root element of this component.
   */
  className?: string;

  /**
   * Additional inline styles.
   */
  style?: CSSProperties;

  /**
   * Enable debug mode?
   */
  debug?: boolean | { position: HudPosition };

  /**
   * Height fitter.
   */
  fitter?: Fitter;
}

/**
 * HighWall component.
 */
export const HighWall: React.FC<HighWallProps> = (props) => {
  // Optimized height
  const [height, setHeight] = useState<number | undefined>(undefined);
  // Debug HUD status
  const [hudPos, setHudPos] = useState<HudPosition | undefined>(undefined);

  // Get style with optimized state
  function getOptimizedStyle() {
    if (height === undefined) return props.style;
    const fitter = props.fitter || defaultFitter;
    return { ...props.style, ...fitter(height) };
  }

  // Debug info which will be shown on HUD
  function getDebugInfo() {
    return {
      styleHeight: height,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  }

  // Determine whether debug HUD should be shown, and its position
  useEffect(() => {
    if (!props.debug) setHudPos(undefined);
    else if (props.debug === true) setHudPos(HudPosition.leftBottom);
    else setHudPos(props.debug.position);
  }, [props.debug]);

  // Effect for height adjustment
  useEffect(() => {
    const adjustHeight = () => setHeight(getViewportHeight());
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return (): void => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, [setHeight]);

  return (
    <div
      data-testid="highwall-root"
      className={classNames('HighWall', props.className)}
      style={getOptimizedStyle()}
    >
      {props.children}
      {hudPos && <Hud position={hudPos} values={getDebugInfo()} />}
    </div>
  );
};

/**
 * Get viewport's height.
 *
 * When clientHeight is used on the root element (the <html> element),
 * the viewport's height (excluding any scrollbar) is returned
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight}
 */
function getViewportHeight(): number {
  const htmlElement = document.documentElement;
  // Probably, window.innerHeight fallback won't be used.
  return htmlElement.clientHeight || window.innerHeight;
}
