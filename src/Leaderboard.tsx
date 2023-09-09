import React, { useMemo } from "react";
import "./Leaderboard.css";
import {
  AorTrackId,
  CarId,
  UnifiedLap,
  makeArrayUniqueByKey,
  secondsToLaptime,
  useCombinedLapsBasedOnDatasetSelection,
} from "./Store";
import { ToggleButton } from "./Toggles";
import { Layout } from "./Layout";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { CARS, TRACKS } from "./constants";
import "./Table.css";

const Table = () => {
  const params = useParams();
  const laps = useCombinedLapsBasedOnDatasetSelection(
    params.track as AorTrackId
  );
  const [fastestDisplayedLap, ...displayedLaps] = useMemo(() => {
    const ls: UnifiedLap[] = [];
    if (params.mode === "drivers") {
      for (const carId in laps) {
        ls.push(...(laps[carId as CarId] || []));
      }
    } else {
      for (const carId in laps) {
        const lap = laps[carId as CarId][0];
        if (lap) {
          ls.push(lap);
        }
      }
    }
    return ls.sort((a, b) => a.lapTime - b.lapTime);
  }, [params.mode, laps]);

  const navigate = useNavigate();
  return (
    <>
      <div className="Leaderboard-tracks">
        {TRACKS.map((t) => (
          <ToggleButton
            key={t.lfmId}
            onClick={() => navigate(`../${t.aorId}/${params.mode}`)}
            selected={params.track === t.aorId}
          >
            <img src={t.flag} alt={"flag for " + t.name} /> {t.name}
          </ToggleButton>
        ))}
      </div>
      <div className="Leaderboard-modes">
        {["drivers", "cars"].map((m) => (
          <ToggleButton
            key={m}
            onClick={() => navigate(`../${params.track}/${m}`)}
            selected={params.mode === m}
          >
            {m}
          </ToggleButton>
        ))}
      </div>
      <table className="Table">
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
          {[fastestDisplayedLap, ...displayedLaps].map((l) => (
            <tr key={l.driverName + l.carName + l.lapTime + l.version}>
              <td>{l.driverName}</td>
              <td>
                <div>
                  <img src={CARS[l.carId as keyof typeof CARS]?.img} alt="" />
                  {l.carName} {l.carClass} ({l.carYear})
                </div>
              </td>
              <td>
                <b>{secondsToLaptime(l.lapTime)}</b>
              </td>
              <td>
                {secondsToLaptime(l.lapTime - fastestDisplayedLap.lapTime)}
              </td>
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

export const Leaderboard = () => {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={TRACKS[0].aorId + "/drivers"} />}
        />
        <Route path=":track" element={<Navigate to={"drivers"} />} />
        <Route path=":track/:mode" element={<Table />} />
      </Routes>
    </Layout>
  );
};
