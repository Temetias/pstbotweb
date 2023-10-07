import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CARS, TRACKS } from "./constants";

export type LfmTrackId = (typeof TRACKS)[number]["lfmId"];

export type AorTrackId = (typeof TRACKS)[number]["aorId"];

export type Version = `${number}.${number}.${number}`;

export type CarId = keyof typeof CARS;

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
  track_id: LfmTrackId; // 124;
  track_name: string; // "Circuit de Catalunya";
  updated_at: string; // "2023-09-03 15:03:02";
  user_id: number; // 65110;
  version: Version; // "1.9.5";
  version_suffix: string; // "5";
  vorname: string; // "Anthony";
}[];

export type LfmGetLapsResponse = {
  data: LfmGetLapsResponseData;
  filters: Record<string, string>;
};

export type LfmBopLap = {
  bop: number; // -2;
  bop_raw: number; // -2;
  car_id: number; // 22;
  car_name: string; // "McLaren 720S GT3";
  car_year: number; // 2019;
  lap: string; // "01:39.800";
  target_dif: string; // "+00:00.031";
};

export type UnifiedLfmBopLap = {
  bop: number;
  bopRaw: number;
  carId: CarId;
  carClass: string;
  carName: string;
  carYear: number;
  lap: string;
  diff: string;
  relevant: "true" | "false";
};

export type LfmGetBopResponse = {
  bopdata: {
    target_time: string; // 01:39.768
    fastestCarMaxBallast: string; // 01:39.768
    KgTime: number; // 0.02
  };
  laps_others: LfmBopLap[];
  laps_relevant: LfmBopLap[];
};

export type AorGetLapsResponse = {
  acc_patch: Version; // "1.9.5";
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
  track: AorTrackId; // "watkins_glen";
}[];

export type UnifiedLap = {
  carId: keyof typeof CARS;
  carClass: string;
  carName: string;
  carYear: number;
  driverName: string;
  lapTime: number;
  s1: number;
  s2: number;
  s3: number;
  track: AorTrackId;
  version: Version;
  server: "AOR" | "LFM";
};

export type StoreData = {
  dataset: "AOR" | "LFM" | "combined";
  usablePatchOnly: boolean;
  lfm: {
    laps: Record<AorTrackId, Record<CarId, UnifiedLap[]>>;
  };
  aor: {
    laps: Record<AorTrackId, Record<CarId, UnifiedLap[]>>;
  };
  bop: Record<AorTrackId, Record<CarId, [UnifiedLfmBopLap]>>;
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
  const isNegative = seconds < 0;
  seconds = Math.abs(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds = remainingSeconds.toFixed(3).padStart(6, "0");
  if (isNegative && minutes === 0) {
    return `-${formattedSeconds}`;
  }
  return minutes
    ? `${isNegative ? "-" : ""}${minutes}:${formattedSeconds}`
    : `${isNegative ? "-" : ""}${formattedSeconds}`;
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

export const useLfmLaps = (
  aorTrackId?: AorTrackId
): Record<CarId, UnifiedLap[]> => {
  const dispatch = useStoreDispatch();
  const store = useStore();
  useEffect(() => {
    if (!aorTrackId) return;
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
            [aorTrackId]: splitArrayByProperty(
              lapsResponse.data
                .map(lfmLapToUnifiedLap)
                .filter(
                  (l) =>
                    !store.usablePatchOnly ||
                    isRelevantVersion(
                      l.version,
                      CARS[l.carId].usablePatch[l.track]
                    )
                )
                .sort((a, b) => a.lapTime - b.lapTime),
              "carId"
            ),
          },
        },
      }));
    });
  }, [aorTrackId, store.usablePatchOnly]);
  return aorTrackId
    ? store.lfm.laps[aorTrackId] || {}
    : ({} as Record<CarId, UnifiedLap[]>);
};

export const useAorLaps = (
  aorTrackId?: AorTrackId
): Record<CarId, UnifiedLap[]> => {
  const dispatch = useStoreDispatch();
  const store = useStore();
  useEffect(() => {
    if (!aorTrackId) return;
    cachedFetch<AorGetLapsResponse>(
      `https://aor-hotlap.skillissue.be/api/hotlaps/${aorTrackId}?patch=1.9`
    ).then((lapsResponse) => {
      dispatch((s) => ({
        ...s,
        aor: {
          ...s.aor,
          laps: {
            ...s.aor.laps,
            [aorTrackId]: splitArrayByProperty(
              lapsResponse
                .map(aorLapToUnifiedLap)
                .filter(
                  (l) =>
                    !store.usablePatchOnly ||
                    isRelevantVersion(
                      l.version,
                      CARS[l.carId].usablePatch[l.track]
                    )
                )
                .sort((a, b) => a.lapTime - b.lapTime),
              "carId"
            ),
          },
        },
      }));
    });
  }, [aorTrackId, store.usablePatchOnly]);
  return aorTrackId
    ? store.aor.laps[aorTrackId] || {}
    : ({} as Record<CarId, UnifiedLap[]>);
};

export const useBop = (
  aorTrackId?: AorTrackId
): Record<CarId, [UnifiedLfmBopLap]> => {
  const dispatch = useStoreDispatch();
  const store = useStore();
  useEffect(() => {
    if (!aorTrackId) return;
    const lfmTrackId = TRACKS.find((t) => t.aorId === aorTrackId)?.lfmId;
    if (!lfmTrackId) return;
    cachedFetch<LfmGetBopResponse>(
      `https://api2.lowfuelmotorsport.com/api/hotlaps/getBopPrediction?track=${lfmTrackId}`
    ).then((bopResponse) => {
      dispatch((s) => ({
        ...s,
        bop: {
          ...s.bop,
          [aorTrackId]: {
            ...splitArrayByProperty(
              bopResponse.laps_relevant.map((l) => ({
                ...buildLfmUnifiedLapCarData(l.car_name, "GT3", l.car_year),
                bop: l.bop,
                bopRaw: l.bop_raw,
                lap: l.lap,
                diff: l.target_dif,
                relevant: "true",
              })),
              "carId"
            ),
            ...splitArrayByProperty(
              bopResponse.laps_others.map((l) => ({
                ...buildLfmUnifiedLapCarData(l.car_name, "GT3", l.car_year),
                bop: l.bop,
                bopRaw: l.bop_raw,
                lap: l.lap,
                diff: l.target_dif,
                relevant: "false",
              })),
              "carId"
            ),
          },
        },
      }));
    });
  }, [aorTrackId]);
  return aorTrackId
    ? store.bop[aorTrackId] || {}
    : ({} as Record<CarId, [UnifiedLfmBopLap]>);
};

const aorLapToUnifiedLap = (l: AorGetLapsResponse[number]): UnifiedLap => {
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
          .replace("clubsport", "")
          .replace("huracan", "huracán")
          .replace("supertrofeo", "super trofeo")
          .replace("mercedes-amg", "mercedes amg")
          .replace(/\s+/g, " ")
          .trim();
  const carClass = l.car_class
    .toUpperCase()
    .replace("SUPER TROFEO", "ST")
    .replace("BMW M2", "TCX");
  const carYear =
    l.car_name === "ferrari 488 challenge evo"
      ? 2020
      : parseInt(l.car_name.split("(")[1].split(")")[0]);
  const carId = `${carName} ${carClass} (${carYear})` as CarId;
  return {
    carId,
    carClass,
    carName,
    carYear,
    driverName: l.driver_name.toLowerCase().split("|")[0].trim(),
    lapTime: l.lap_time,
    s1: l.s1_time,
    s2: l.s2_time,
    s3: l.s3_time,
    track: TRACKS.find((t) => t.aorId === l.track)!.aorId,
    version: l.acc_patch,
    server: "AOR",
  };
};

const buildLfmUnifiedLapCarData = (
  carNameRaw: string,
  carClassRaw: string,
  carYearRaw: number
) => {
  const carName = carNameRaw
    .toLowerCase()
    .replace("gt3", "")
    .replace("gt4", "")
    .replace("991ii", "991 ii")
    .replace("gt r", "gt-r")
    .replace("clubsport", "")
    .replace("huracan", "huracán")
    .replace("supertrofeo", "super trofeo")
    .replace(/\s+/g, " ")
    .replace("mercedes-amg", "mercedes amg")
    .replace("bmw m2 cs racing", "bmw m2 cs")
    .replace("porsche 911 cup (type 992)", "porsche 992 cup")
    .trim();
  const carClass = carClassRaw.toUpperCase().replace("SUPER TROFEO", "ST");
  const carYear =
    carName === "bmw m4" && carClass === "GT3" ? 2022 : carYearRaw;
  const carId = `${carName} ${carClass} (${carYear})` as CarId;
  return { carName, carClass, carYear, carId };
};

const lfmLapToUnifiedLap = (l: LfmGetLapsResponseData[number]): UnifiedLap => {
  const { carName, carClass, carYear, carId } = buildLfmUnifiedLapCarData(
    l.car_name,
    l.car_class,
    l.car_year
  );
  return {
    carId,
    carClass,
    carName,
    carYear,
    driverName: `${l.vorname.split("|")[0].trim()} ${l.nachname
      .split("|")[0]
      .trim()}`,
    lapTime: laptimeToSeconds(l.lap),
    s1: laptimeToSeconds(l.s1),
    s2: laptimeToSeconds(l.s2),
    s3: laptimeToSeconds(l.s3),
    track: TRACKS.find((t) => t.lfmId === l.track_id)!.aorId,
    version: l.version,
    server: "LFM",
  };
};

export const combineLapsBasedOnDataSetSelection = (
  dataset: "combined" | "AOR" | "LFM",
  aorLaps: Record<CarId, UnifiedLap[]>,
  lfmLaps: Record<CarId, UnifiedLap[]>
): Record<CarId, UnifiedLap[]> => {
  const aorLapsByDataset =
    dataset !== "LFM" ? aorLaps : ({} as Record<CarId, UnifiedLap[]>);
  const lfmLapsByDataset =
    dataset !== "AOR" ? lfmLaps : ({} as Record<CarId, UnifiedLap[]>);
  const combinedLaps: Record<CarId, UnifiedLap[]> = {} as Record<
    CarId,
    UnifiedLap[]
  >;
  for (const _carId in aorLapsByDataset) {
    const carId: CarId = _carId as CarId;
    combinedLaps[carId] = aorLapsByDataset[carId];
  }
  for (const _carId in lfmLapsByDataset) {
    const carId: CarId = _carId as CarId;
    combinedLaps[carId] = [
      ...(combinedLaps[carId] || []),
      ...lfmLapsByDataset[carId],
    ].sort((a, b) => a.lapTime - b.lapTime);
  }
  return combinedLaps;
};

export const useCombinedLapsBasedOnDatasetSelection = (
  aorTrackId?: AorTrackId
): Record<CarId, UnifiedLap[]> => {
  const { dataset } = useStore();
  const lfmLaps = useLfmLaps(aorTrackId);
  const aorLaps = useAorLaps(aorTrackId);
  return combineLapsBasedOnDataSetSelection(dataset, aorLaps, lfmLaps);
};

export const splitArrayByProperty = <
  T1 extends Record<string, string | number>,
  T2 extends keyof T1
>(
  arr: T1[],
  propertyName: T2
): Record<T1[T2], T1[]> => {
  const resultObject: Record<T1[T2], T1[]> = {} as Record<T1[T2], T1[]>;

  for (const item of arr) {
    const propertyValue = item[propertyName];
    if (!resultObject[propertyValue]) {
      resultObject[propertyValue] = [];
    }
    resultObject[propertyValue].push(item);
  }

  return resultObject;
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

export const isRelevantVersion = (subject: Version, target: Version) => {
  const v1 = subject.split(".").map(Number);
  const v2 = target.split(".").map(Number);
  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;
    if (num1 > num2) {
      return true;
    } else if (num1 < num2) {
      return false;
    }
  }
  return true;
};

const StoreContext = createContext<{
  store: StoreData;
  dispatch: React.Dispatch<React.SetStateAction<StoreData>>;
}>({
  dispatch: (_) => {},
  store: {
    dataset: "combined",
    usablePatchOnly: true,
    lfm: {
      laps: {} as Record<AorTrackId, Record<CarId, UnifiedLap[]>>,
    },
    aor: {
      laps: {} as Record<AorTrackId, Record<CarId, UnifiedLap[]>>,
    },
    bop: {} as Record<AorTrackId, Record<CarId, [UnifiedLfmBopLap]>>,
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
      laps: {} as Record<AorTrackId, Record<CarId, UnifiedLap[]>>,
    },
    dataset: "combined",
    usablePatchOnly: true,
    lfm: {
      laps: {} as Record<AorTrackId, Record<CarId, UnifiedLap[]>>,
    },
    bop: {} as Record<AorTrackId, Record<CarId, [UnifiedLfmBopLap]>>,
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
