import { render } from '@testing-library/react';
import App from './app';

// Mock the FavoritesDashboard component to avoid RxJS issues in tests
jest.mock('./components/FavoritesDashboard', () => {
  return function MockFavoritesDashboard() {
    return <div data-testid="favorites-dashboard">Favorites Dashboard</div>;
  };
});

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the favorites dashboard component', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('favorites-dashboard')).toBeTruthy();
  });
});
