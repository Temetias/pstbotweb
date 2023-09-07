import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Layout } from "./Layout";
import { CARS, TRACKS } from "./constants";
import {
  secondsToLaptime,
  useCombinedLapsBasedOnDatasetSelection,
} from "./Store";
import { ToggleButton } from "./Toggles";

const Table = () => {
  const params = useParams();
  const laps = useCombinedLapsBasedOnDatasetSelection(params.track);
  const navigate = useNavigate();
  return (
    <>
      <div>
        {TRACKS.map((t) => (
          <ToggleButton
            key={t.lfmId}
            onClick={() => navigate(`../${t.aorId}`)}
            selected={params.track === t.aorId}
          >
            {t.name}
          </ToggleButton>
        ))}
      </div>
      <table className="Laps-table">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Car</th>
            <th>Lap</th>
            <th>Gap</th>
            <th>S1</th>
            <th>S2</th>
            <th>S3</th>
            <th>Version</th>
            <th>Server</th>
          </tr>
        </thead>
        <tbody>
          {laps.map((l) => (
            <tr key={l.driverName + l.carName + l.lapTime + l.version}>
              <td>{l.driverName}</td>
              <td>
                <div>
                  <img src={CARS[l.carId as keyof typeof CARS]?.img} alt="" />
                  {l.carName} {l.carClass} ({l.carYear})
                </div>
              </td>
              <td>{secondsToLaptime(l.lapTime)}</td>
              <td>{l.gap ? secondsToLaptime(l.gap) : ""}</td>
              <td>{secondsToLaptime(l.s1)}</td>
              <td>{secondsToLaptime(l.s2)}</td>
              <td>{secondsToLaptime(l.s3)}</td>
              <td>{l.version}</td>
              <td>{l.server}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export const Bop = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={TRACKS[0].aorId} />} />
        <Route path=":track" element={<Table />} />
      </Routes>
    </Layout>
  );
};
