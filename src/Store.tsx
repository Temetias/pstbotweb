import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { TRACKS } from "./constants";

export type LfmGetLapsResponseData = {
  car_class: string; // "GT3";
  car_id: number; // 32;
  car_name: string; // "Ferrari 296 GT3";
  car_year: number; // 2023;
  created_at: string; // "2023-09-03 15:03:02";
  elo: number; // 2736;
  gameversion: number; // 49;
  gap: number; // 0;
  lap: string; // "01:42.972";
  lap_id: number; // 219;
  lap_valid: number; // 1;
  lapdate: string; // "2023-09-03 15:03:02";
  major_version: string; // "1.9";
  nachname: string; // "Vanhove";
  origin: string; // "FR";
  s1: string; // "00:29.102";
  s2: string; // "00:39.580";
  s3: string; // "00:34.290";
  split: number; // 1;
  splits: string; // "[29102,39580,34290]";
  steamid: string; // "76561198882393980";
  track_id: number; // 124;
  track_name: string; // "Circuit de Catalunya";
  updated_at: string; // "2023-09-03 15:03:02";
  user_id: number; // 65110;
  version: string; // "1.9.5";
  version_suffix: string; // "5";
  vorname: string; // "Anthony";
}[];

export type LfmGetLapsResponse = {
  data: LfmGetLapsResponseData;
  filters: Record<string, string>;
};

export type AorGetLapsResponse = {
  acc_patch: string; // "1.9.5";
  avg_speed: number; // 195;
  car_class: string; // "gt3";
  car_name: string; // "lamborghini huracan evo 2 (2023)";
  driver_name: string; // "Vyacheslav Abuladze";
  gap_to_leader: number; // 0.3400000035762787;
  lap_time: number; // 102.2969970703125;
  s1_time: number; // 29.121999740600586;
  s2_time: number; // 33.209999084472656;
  s3_time: number; // 39.96500015258789;
  scrape_date: number; // "Mon, 28 Aug 2023 20:48:42 GMT";
  track: string; // "watkins_glen";
}[];

export type UnifiedLap = {
  carId: string;
  carClass: string;
  carName: string;
  carYear: number;
  driverName: string;
  lapTime: number;
  gap: number;
  negativeGap: number;
  s1: number;
  s2: number;
  s3: number;
  track: string;
  version: string;
  server: "AOR" | "LFM";
};

export type StoreData = {
  dataset: "AOR" | "LFM" | "combined";
  lfm: {
    laps: Record<string, LfmGetLapsResponseData>;
  };
  aor: {
    laps: Record<string, AorGetLapsResponse>;
  };
};

export const laptimeToSeconds = (laptime: string) => {
  const [minuteStr, secondStr] = laptime.split(":");
  const [secondPart, millisecondPart] = secondStr.split(".");
  const minutes = parseInt(minuteStr, 10) || 0;
  const seconds = parseInt(secondPart, 10) || 0;
  const milliseconds = parseInt(millisecondPart, 10) || 0;
  return minutes * 60 + seconds + milliseconds / 1000;
};

export const secondsToLaptime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds = remainingSeconds.toFixed(3).padStart(6, "0");
  return minutes ? `${minutes}:${formattedSeconds}` : formattedSeconds;
};

const cachedFetch = (() => {
  const cache: Record<string, Promise<any>> = {};

  return async <T extends any>(url: string, init?: RequestInit): Promise<T> => {
    if (url in cache) {
      // If there is an ongoing fetch request for the same URL, return its promise.
      return cache[url];
    }
    const fetchPromise = fetch(url, init)
      .then((res) => res.json())
      .then((res: T) => {
        // No need to nullify the promise; just return the response.
        return res;
      })
      .catch((error) => {
        // Handle errors and remove the promise from the cache in case of an error.
        delete cache[url];
        throw error;
      });

    // Store the promise in the cache to indicate an ongoing request.
    cache[url] = fetchPromise;
    return fetchPromise;
  };
})();

export const useLfmLaps = (aorTrackId?: string) => {
  const dispatch = useStoreDispatch();
  const store = useStore();
  useEffect(() => {
    if (!aorTrackId || !!store.lfm.laps[aorTrackId]?.length) return;
    const lfmTrackId = TRACKS.find((t) => t.aorId === aorTrackId)?.lfmId;
    if (!lfmTrackId) return;
    cachedFetch<LfmGetLapsResponse>(
      `https://api2.lowfuelmotorsport.com/api/hotlaps?track=${lfmTrackId}&major=1.9`
    ).then((lapsResponse) => {
      dispatch((s) => ({
        ...s,
        lfm: {
          ...s.lfm,
          laps: {
            ...s.lfm.laps,
            [aorTrackId]: lapsResponse.data,
          },
        },
      }));
    });
  }, [aorTrackId]);
  return aorTrackId ? store.lfm.laps[aorTrackId] || [] : [];
};

export const useAorLaps = (aorTrackId?: string) => {
  const dispatch = useStoreDispatch();
  const store = useStore();
  useEffect(() => {
    if (!aorTrackId || !!store.aor.laps[aorTrackId]?.length) return;
    cachedFetch<AorGetLapsResponse>(
      `https://aor-hotlap.skillissue.be/api/hotlaps/${aorTrackId}?patch=1.9`
    ).then((lapsResponse) => {
      dispatch((s) => ({
        ...s,
        aor: {
          ...s.aor,
          laps: {
            ...s.aor.laps,
            [aorTrackId]: lapsResponse,
          },
        },
      }));
    });
  }, [aorTrackId]);
  return aorTrackId ? store.aor.laps[aorTrackId] || [] : [];
};

const aorLapToUnifiedLapWithoutGaps = (
  l: AorGetLapsResponse[number]
): Omit<UnifiedLap, "gap" | "negativeGap"> => {
  const carName =
    l.car_name === "ferrari 488 challenge evo"
      ? l.car_name
      : l.car_name
          .split("(")[0]
          .toLowerCase()
          .replace("gt3", "")
          .replace("gt4", "")
          .replace("991ii", "991 ii")
          .replace("gt r", "gt-r")
          .replace("huracan", "huracán")
          .replace("supertrofeo", "super trofeo")
          .replace(/\s+/g, " ")
          .trim();
  const carClass = l.car_class.toUpperCase().replace("SUPER TROFEO", "ST");
  const carYear =
    l.car_name === "ferrari 488 challenge evo"
      ? 2020
      : parseInt(l.car_name.split("(")[1].split(")")[0]);
  const carId = `${carName} ${carClass} (${carYear})`;
  return {
    carId,
    carClass,
    carName,
    carYear,
    driverName: l.driver_name,
    lapTime: l.lap_time,
    s1: l.s1_time,
    s2: l.s2_time,
    s3: l.s3_time,
    track: TRACKS.find((t) => t.aorId === l.track)?.name || "",
    version: l.acc_patch,
    server: "AOR",
  };
};

const lfmLapToUnifiedLapWithoutGaps = (
  l: LfmGetLapsResponseData[number]
): Omit<UnifiedLap, "gap" | "negativeGap"> => {
  const carName = l.car_name
    .toLowerCase()
    .replace("gt3", "")
    .replace("991ii", "991 ii")
    .replace("gt r", "gt-r")
    .replace("huracan", "huracán")
    .replace("supertrofeo", "super trofeo")
    .replace(/\s+/g, " ")
    .trim();
  const carClass = l.car_class.toUpperCase().replace("SUPER TROFEO", "ST");
  const carYear =
    carName === "bmw m4" && carClass === "GT3" ? 2022 : l.car_year;
  const carId = `${carName} ${carClass} (${carYear})`;
  return {
    carId,
    carClass,
    carName,
    carYear,
    driverName: `${l.vorname} ${l.nachname}`,
    lapTime: laptimeToSeconds(l.lap),
    s1: laptimeToSeconds(l.s1),
    s2: laptimeToSeconds(l.s2),
    s3: laptimeToSeconds(l.s3),
    track: TRACKS.find((t) => t.lfmId === l.track_id)?.name || "",
    version: l.version,
    server: "LFM",
  };
};

const addGapToUnifiedLap =
  (fastestLap: Omit<UnifiedLap, "gap" | "negativeGap">) =>
  (lap: Omit<UnifiedLap, "gap" | "negativeGap">) => ({
    ...lap,
    gap: lap.lapTime - fastestLap.lapTime,
    negativeGap: 0,
  });

export const combineLapsBasedOnDataSetSelection = (
  dataset: "combined" | "AOR" | "LFM",
  aorLaps: AorGetLapsResponse,
  lfmLaps: LfmGetLapsResponseData
) => {
  const unifiedAorLaps =
    dataset !== "LFM" ? aorLaps.map(aorLapToUnifiedLapWithoutGaps) : [];
  const unifiedLfmLaps =
    dataset !== "AOR" ? lfmLaps.map(lfmLapToUnifiedLapWithoutGaps) : [];
  const [fastest, secondFastest, ...rest] = [
    ...unifiedAorLaps,
    ...unifiedLfmLaps,
  ].sort((a, b) => a.lapTime - b.lapTime);
  return [
    {
      ...fastest,
      gap: 0,
      negativeGap: secondFastest?.lapTime - fastest?.lapTime,
    },
    ...rest.map(addGapToUnifiedLap(fastest)),
  ];
};

export const useCombinedLapsBasedOnDatasetSelection = (
  aorTrackId?: string
): UnifiedLap[] => {
  const { dataset } = useStore();
  const lfmLaps = useLfmLaps(aorTrackId);
  const aorLaps = useAorLaps(aorTrackId);
  return combineLapsBasedOnDataSetSelection(dataset, aorLaps, lfmLaps);
};

export const makeArrayUniqueByKey = <T extends object>(
  arr: T[],
  key: keyof T,
  maxUniqueItems?: number
) => {
  const uniqueSet = new Set<T[typeof key]>();
  const uniqueArr: T[] = [];
  for (const obj of arr) {
    if (!uniqueSet.has(obj[key])) {
      uniqueSet.add(obj[key]);
      uniqueArr.push(obj);
    }
    if (maxUniqueItems && uniqueArr.length >= maxUniqueItems) break;
  }
  return uniqueArr;
};

export const findMostCommonValue = <T extends object>(
  arr: T[],
  propertyName: keyof T
): T[keyof T] | null => {
  const valueFrequencies: Record<string, number> = {};

  arr.forEach((item) => {
    const value = item[propertyName] as string;
    valueFrequencies[value] = (valueFrequencies[value] || 0) + 1;
  });
  let mostCommonValue: T[keyof T] | null = null;
  let maxFrequency = 0;
  for (const value in valueFrequencies) {
    if (valueFrequencies[value] > maxFrequency) {
      mostCommonValue = value as T[keyof T];
      maxFrequency = valueFrequencies[value];
    }
  }
  return mostCommonValue;
};

const StoreContext = createContext<{
  store: StoreData;
  dispatch: React.Dispatch<React.SetStateAction<StoreData>>;
}>({
  dispatch: (_) => {},
  store: {
    dataset: "combined",
    lfm: {
      laps: {},
    },
    aor: {
      laps: {},
    },
  },
});

export const useStore = () => {
  const { store } = useContext(StoreContext);
  return store;
};

export const useStoreDispatch = () => {
  const { dispatch } = useContext(StoreContext);
  return dispatch;
};

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const [storeState, setStoreState] = useState<StoreData>({
    aor: {
      laps: {},
    },
    dataset: "combined",
    lfm: {
      laps: {},
    },
  });

  return (
    <StoreContext.Provider
      value={{
        store: storeState,
        dispatch: setStoreState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
