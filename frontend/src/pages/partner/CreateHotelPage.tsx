import { useNavigate } from 'react-router-dom';
import { createHotel } from '../../api/hotels';
import HotelForm from '../../components/partner/HotelForm';

export default function CreateHotelPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight text-apple-text mb-6">Create New Hotel</h1>
      <HotelForm
        submitLabel="Create Hotel"
        onSubmit={async (data) => {
          await createHotel(data);
          navigate('/partner/hotels');
        }}
      />
    </div>
  );
}
