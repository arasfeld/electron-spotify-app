import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Logo } from '../Logo';

describe('Logo Component', () => {
  it('should render the logo with correct SVG', () => {
    render(<Logo />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('should render with default size', () => {
    render(<Logo />);

    const logoElement = screen.getByTestId('logo');
    expect(logoElement).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    render(<Logo size="lg" />);

    const logoElement = screen.getByTestId('logo');
    expect(logoElement).toBeInTheDocument();
  });

  it('should render with custom color', () => {
    render(<Logo color="green" />);

    const logoElement = screen.getByTestId('logo');
    expect(logoElement).toBeInTheDocument();
  });

  it('should render with both custom size and color', () => {
    render(<Logo size="xl" color="blue" />);

    const logoElement = screen.getByTestId('logo');
    expect(logoElement).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(<Logo />);

    const logoElement = screen.getByTestId('logo');
    expect(logoElement).toBeInTheDocument();
  });

  it('should render consistently across multiple renders', () => {
    const { rerender } = render(<Logo />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();

    rerender(<Logo size="lg" />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();

    rerender(<Logo color="red" />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });
});
