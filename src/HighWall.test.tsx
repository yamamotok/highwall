import { act, cleanup, render } from '@testing-library/react';
import React from 'react';

import { Fitter, HighWall, HudPosition } from './HighWall';

const vh = 500;

describe('HighWall', () => {
  function setDocumentClientHeight(height: number) {
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: height,
      configurable: true,
    });
  }

  beforeEach(() => {
    setDocumentClientHeight(vh);
  });

  afterEach(() => {
    cleanup();
  });

  it('has children', () => {
    const rendered = render(
      <HighWall>
        <p>Child</p>
      </HighWall>
    );
    const child = rendered.getByText(/Child/);
    expect(child).toBeInTheDocument();
  });

  it('has height style inline', () => {
    const rendered = render(<HighWall />);
    const element = rendered.getByTestId('highwall-root');
    expect(element.style.height).toBe(`${vh}px`);
  });

  it('updates height when window was resized', async (done) => {
    const rendered = render(<HighWall />);
    const element = rendered.getByTestId('highwall-root');

    const newHeight = 100;
    await act(async () => {
      return new Promise<void>((resolve) => {
        setDocumentClientHeight(newHeight);
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => {
          resolve();
        }, 10);
      });
    });
    expect(element.style.height).toBe(`${newHeight}px`);
    done();
  });

  it('works correct with custom fitter function', () => {
    const fitter: Fitter = (height) => ({ minHeight: height });
    const rendered = render(<HighWall fitter={fitter} />);
    const element = rendered.getByTestId('highwall-root');
    expect(element.style.height).toBeFalsy();
    expect(element.style.minHeight).toBe(`${vh}px`);
  });
});

describe('HighWall debug HUD', () => {
  it('is not rendered when no `debug` property', () => {
    const rendered = render(<HighWall />);
    expect(rendered.queryByTestId('highwall-hud')).toBeNull();
  });

  it('is rendered with default position when `debug` property is true', () => {
    const rendered = render(<HighWall debug={true} />);
    const hudElement = rendered.getByTestId('highwall-hud');
    expect(hudElement.className.split(/\s/)).toContain('leftBottom');
  });

  it('is rendered with a custom position', () => {
    const rendered = render(<HighWall debug={{ position: HudPosition.rightTop }} />);
    const hudElement = rendered.getByTestId('highwall-hud');
    expect(hudElement.className.split(/\s/)).toContain('rightTop');
  });
});
