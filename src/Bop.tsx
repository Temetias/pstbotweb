import React, { useMemo } from "react";
import "./Leaderboard.css";
import { AorTrackId, useBop } from "./Store";
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
  const bop = useBop(params.track as AorTrackId);
  const navigate = useNavigate();
  return (
    <>
      <div className="Leaderboard-tracks">
        {TRACKS.map((t) => (
          <ToggleButton
            key={t.lfmId}
            onClick={() => navigate(`../${t.aorId}`)}
            selected={params.track === t.aorId}
          >
            <img src={t.flag} alt={"flag for " + t.name} /> {t.name}
          </ToggleButton>
        ))}
      </div>
      <table className="Table Leaderboard-table">
        <thead>
          <tr>
            <th>Car</th>
            <th>Lap</th>
            <th>Gap to target</th>
            <th>BOP mathematical</th>
            <th>BOP real</th>
            <th>Relevant</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(bop)
            .sort(([, ls1], [, ls2]) => ls2[0].bopRaw - ls1[0].bopRaw)
            .map(([carId, ls]) => {
              const [l] = ls;
              return (
                <tr key={carId}>
                  <td>
                    <div>
                      <img src={CARS[carId as keyof typeof CARS]?.img} alt="" />
                      {l.carName} {l.carClass} ({l.carYear})
                    </div>
                  </td>
                  <td>
                    <b>{l.lap}</b>
                  </td>
                  <td>{l.diff}</td>
                  <td>{l.bopRaw}</td>
                  <td>{l.bop}</td>
                  <td>{l.relevant === "true" ? "X" : ""}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export const Bop = () => {
  return (
    <Layout hideDataset={true}>
      <Routes>
        <Route path="/" element={<Navigate to={TRACKS[0].aorId} />} />
        <Route path=":track" element={<Table />} />
      </Routes>
    </Layout>
  );
};
