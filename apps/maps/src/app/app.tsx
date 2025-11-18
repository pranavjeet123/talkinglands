import { MapsWelcome } from './maps-welcome';
import LocationList from './components/LocationList';
import '../styles.css';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <MapsWelcome />
          </div>
          <div>
            <LocationList />
          </div>
        </div>
      </div>
    </div>
  );
}
