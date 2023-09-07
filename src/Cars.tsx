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
  UnifiedLap,
  combineLapsBasedOnDataSetSelection,
  findMostCommonValue,
  secondsToLaptime,
  useCombinedLapsBasedOnDatasetSelection,
  useStore,
} from "./Store";
import { ToggleButton } from "./Toggles";
import "./Cars.css";
import { useMemo, useState } from "react";
import "./Table.css";

const TableTrackRow = ({
  aorTrackId,
  carId,
}: {
  aorTrackId: string;
  carId: string;
}) => {
  const laps = useCombinedLapsBasedOnDatasetSelection(aorTrackId);
  const lap = laps.find((l) => l.carId === carId);
  const track = TRACKS.find((t) => t.aorId === aorTrackId);
  if (!lap || !track)
    return (
      <tr>
        <td>
          <img src={track?.flag} alt={"Flag for " + track?.name} />
          {track?.name}
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  return (
    <tr>
      <td>
        <img src={track.flag} alt={"Flag for " + track.name} />
        {track.name}
      </td>
      <td>{secondsToLaptime(lap.lapTime)}</td>
      <td>
        <b>
          {lap.negativeGap
            ? `-${secondsToLaptime(lap.negativeGap)}`
            : secondsToLaptime(lap.gap)}
        </b>
      </td>
      <td>{lap.driverName}</td>
      <td>{lap.version}</td>
      <td>{lap.server}</td>
    </tr>
  );
};

const CarContent = ({ carId }: { carId: string }) => {
  const store = useStore();
  const fastestLaps = useMemo(() => {
    return TRACKS.map((t) => {
      const laps = combineLapsBasedOnDataSetSelection(
        store.dataset,
        store.aor.laps[t.aorId] || [],
        store.lfm.laps[t.lfmId] || []
      );
      const lap = laps.find((l) => l.carId === carId);
      return lap;
    }).filter((l) => !!l) as UnifiedLap[];
  }, [carId, store.dataset, store.aor.laps, store.lfm.laps]);
  return (
    <div className="Cars-content">
      <table className="Table Cars-table">
        <thead>
          <tr>
            <th>Track</th>
            <th>Lap</th>
            <th>Gap</th>
            <th>Driver</th>
            <th>Version</th>
            <th>Server</th>
          </tr>
        </thead>
        <tbody>
          {TRACKS.map(
            (t) =>
              carId && (
                <TableTrackRow
                  key={t.aorId}
                  aorTrackId={t.aorId}
                  carId={carId}
                />
              )
          )}
        </tbody>
      </table>
      <div className="Cars-info">
        <label htmlFor="">
          <b>Average gap: </b>
          <span>
            {secondsToLaptime(
              fastestLaps.reduce(
                (acc, cur) => acc + cur.gap - cur.negativeGap,
                0
              ) / fastestLaps.length
            )}
          </span>
        </label>
        <label htmlFor="">
          <b>Most records: </b>{" "}
          <span>{findMostCommonValue(fastestLaps, "driverName")}</span>
        </label>
        <label htmlFor="">
          <b>Best track: </b>
          <span>
            {
              fastestLaps.reduce(
                (acc, cur) =>
                  cur.gap - cur.negativeGap < acc.gap - acc.negativeGap
                    ? cur
                    : acc,
                fastestLaps[0]
              ).track
            }
          </span>
        </label>
        <label htmlFor="">
          <b>Worst track: </b>
          <span>
            {
              fastestLaps.reduce(
                (acc, cur) =>
                  cur.gap - cur.negativeGap > acc.gap - acc.negativeGap
                    ? cur
                    : acc,
                fastestLaps[0]
              ).track
            }
          </span>
        </label>
      </div>
    </div>
  );
};

const Table = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [hideIrrelevant, setHideIrrelevant] = useState(true);
  return (
    <>
      <div className="Cars-selections">
        {Object.entries(CARS)
          .filter(([, v]) => !hideIrrelevant || v.lfmRelevant)
          .map(([k, v]) => (
            <ToggleButton
              key={k}
              onClick={() => navigate(`../${k}`)}
              selected={params.car === k}
            >
              <img src={v.img} alt="" />
              {k}
            </ToggleButton>
          ))}
        {hideIrrelevant ? (
          <ToggleButton
            onClick={() => setHideIrrelevant(false)}
            selected={false}
          >
            Show more cars...
          </ToggleButton>
        ) : (
          <ToggleButton
            onClick={() => setHideIrrelevant(true)}
            selected={false}
          >
            Show less cars...
          </ToggleButton>
        )}
      </div>
      {params.car && <CarContent carId={params.car} />}
    </>
  );
};

export const Cars = () => {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={encodeURIComponent(
                Object.entries(CARS).find(([, v]) => v.lfmRelevant)?.[0] || ""
              )}
            />
          }
        />
        <Route path=":car" element={<Table />} />
      </Routes>
    </Layout>
  );
};
