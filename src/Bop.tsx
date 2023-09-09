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

export const Bop = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={TRACKS[0].aorId} />} />
        <Route path=":track" element={<h1 />} />
      </Routes>
    </Layout>
  );
};
