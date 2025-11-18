import { render } from '@testing-library/react';
import App from './app';

// Mock the LocationList component to avoid JSON import issues in tests
jest.mock('./components/LocationList', () => {
  return function MockLocationList() {
    return <div data-testid="location-list">Location List</div>;
  };
});

// Mock the POIMap component to avoid Leaflet issues in tests  
jest.mock('./components/POIMap', () => {
  return {
    POIMap: function MockPOIMap() {
      return <div data-testid="poi-map">POI Map</div>;
    }
  };
});

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the location list component', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('location-list')).toBeTruthy();
  });
});
