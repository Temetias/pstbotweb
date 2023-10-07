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
  AorTrackId,
  CarId,
  UnifiedLap,
  combineLapsBasedOnDataSetSelection,
  findMostCommonValue,
  makeArrayUniqueByKey,
  secondsToLaptime,
  useBop,
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
  aorTrackId: AorTrackId;
  carId: CarId;
}) => {
  const laps = useCombinedLapsBasedOnDatasetSelection(aorTrackId);
  const lap = laps[carId]?.[0];
  const bop = useBop(aorTrackId)[carId]?.[0];
  const dataset = useStore().dataset;

  const fastestLapsForOtherCars = useMemo(() => {
    let lapsClone = { ...laps };
    delete lapsClone[carId];
    return Object.values(lapsClone)
      .map((l) => l[0])
      .sort((a, b) => a.lapTime - b.lapTime);
  }, [aorTrackId, carId, laps, lap]);

  const fastestLapForOtherCars = fastestLapsForOtherCars.find(
    (l) => l.track === aorTrackId
  );
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
          {fastestLapForOtherCars &&
            secondsToLaptime(lap.lapTime - fastestLapForOtherCars.lapTime)}
        </b>
      </td>
      {dataset === "combined" && (
        <td>
          {bop?.bop} {bop?.bop !== bop?.bopRaw ? `(${bop?.bopRaw})` : ""}
        </td>
      )}
      <td>{lap.driverName}</td>
      <td>{lap.version}</td>
      <td>{lap.server}</td>
    </tr>
  );
};

const CarContent = ({ carId }: { carId: CarId }) => {
  const store = useStore();
  const fastestLapsForCar = useMemo(() => {
    return TRACKS.map((t) => {
      const laps = combineLapsBasedOnDataSetSelection(
        store.dataset,
        store.aor.laps[t.aorId] || {},
        store.lfm.laps[t.aorId] || {}
      );
      const lap = laps[carId]?.[0];
      return lap;
    }).filter((l) => !!l) as UnifiedLap[];
  }, [carId, store.dataset, store.aor.laps, store.lfm.laps]);

  const fastestLapsForOtherCars = useMemo(() => {
    return TRACKS.flatMap((t) => {
      const laps = combineLapsBasedOnDataSetSelection(
        store.dataset,
        store.aor.laps[t.aorId] || {},
        store.lfm.laps[t.aorId] || {}
      );
      delete laps[carId];
      return Object.values(laps).map((l) => l[0]);
    }).filter((l) => !!l) as UnifiedLap[];
  }, [carId, store.dataset, store.aor.laps, store.lfm.laps]);

  const [bestTrack, worstTrack] = useMemo(() => {
    const comparisonLaps: UnifiedLap[] = makeArrayUniqueByKey(
      fastestLapsForOtherCars.sort((a, b) => a.lapTime - b.lapTime),
      "track"
    );
    let [bestTrack, bestRelativeGap]: [
      UnifiedLap | undefined,
      number | undefined
    ] = [undefined, undefined];
    let [worstTrack, worstRelativeGap]: [
      UnifiedLap | undefined,
      number | undefined
    ] = [undefined, 0];

    for (const l of fastestLapsForCar) {
      if (!bestTrack) {
        bestTrack = l;
      }
      if (!worstTrack) {
        worstTrack = l;
      }
      const comparisonLap = comparisonLaps.find((cl) => cl.track === l.track);
      if (!comparisonLap) continue;

      const absoluteGap = l.lapTime - comparisonLap.lapTime;
      const relativeGap = absoluteGap / l.lapTime; // Relative gap based on lap length

      if (bestRelativeGap === undefined || relativeGap < bestRelativeGap) {
        bestRelativeGap = relativeGap;
        bestTrack = l;
      }
      if (relativeGap > worstRelativeGap) {
        worstRelativeGap = relativeGap;
        worstTrack = l;
      }
    }
    return [bestTrack, worstTrack];
  }, [fastestLapsForCar, fastestLapsForOtherCars, carId]);

  const averageGap = useMemo(() => {
    let totalGap = 0;
    let count = 0;
    for (const l of fastestLapsForCar) {
      const comparisonLap = fastestLapsForOtherCars.find(
        (cl) => cl.track === l.track
      );
      if (!comparisonLap) continue;
      totalGap += l.lapTime - comparisonLap.lapTime;
      count++;
    }
    return totalGap / count;
  }, [fastestLapsForCar, fastestLapsForOtherCars]);

  return (
    <div className="Cars-content">
      <table className="Table Cars-table">
        <thead>
          <tr>
            <th>Track</th>
            <th>Lap</th>
            <th>Gap</th>
            {store.dataset === "combined" && <th>BOP</th>}
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
          <span>{secondsToLaptime(averageGap)}</span>
        </label>
        <label htmlFor="">
          <b>Most records: </b>{" "}
          <span>{findMostCommonValue(fastestLapsForCar, "driverName")}</span>
        </label>
        <label htmlFor="">
          <b>Best track: </b>
          <span>{TRACKS.find((t) => t.aorId === bestTrack?.track)?.name}</span>
        </label>
        <label htmlFor="">
          <b>Worst track: </b>
          <span>{TRACKS.find((t) => t.aorId === worstTrack?.track)?.name}</span>
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
      {params.car && <CarContent carId={params.car as CarId} />}
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
