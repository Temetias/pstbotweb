import audi from "./logos/audi.png";
import bmw from "./logos/bmw.png";
import porsche from "./logos/porsche.png";
import lamborghini from "./logos/lamborghini.png";
import amg from "./logos/amg.png";
import ferrari from "./logos/ferrari.png";
import honda from "./logos/honda.png";
import mclaren from "./logos/mclaren.png";
import nissan from "./logos/nissan.png";
import aston from "./logos/aston.png";
import bentley from "./logos/bentley.png";
import lexus from "./logos/lexus.png";
import reiter from "./logos/reiter.png";
import alpine from "./logos/alpine.png";
import jaguar from "./logos/jaguar.png";
import ginetta from "./logos/ginetta.png";
import maserati from "./logos/maserati.png";
import chevrolet from "./logos/chevrolet.png";
import ktm from "./logos/ktm.png";
import lfm from "./logos/lfm.png";
import aor from "./logos/aor.png";
import es from "./logos/es.png";
import gb from "./logos/gb.png";
import hu from "./logos/hu.png";
import it from "./logos/it.png";
import de from "./logos/de.png";
import fr from "./logos/fr.png";
import be from "./logos/be.png";
import nl from "./logos/nl.png";
import au from "./logos/au.png";
import jp from "./logos/jp.png";
import us from "./logos/us.png";
import za from "./logos/za.png";

export const TRACKS = [
  {
    lfmId: 124,
    aorId: "barcelona",
    name: "Circuit de Catalunya",
    flag: es,
  },
  {
    lfmId: 125,
    aorId: "brands_hatch",
    name: "Brands Hatch Circuit",
    flag: gb,
  },
  {
    lfmId: 126,
    aorId: "hungaroring",
    name: "Hungaroring",
    flag: hu,
  },
  {
    lfmId: 127,
    aorId: "misano",
    name: "Misano",
    flag: it,
  },
  {
    lfmId: 128,
    aorId: "monza",
    name: "Autodromo Nazionale di Monza",
    flag: it,
  },
  {
    lfmId: 129,
    aorId: "nurburgring",
    name: "Nürburgring",
    flag: de,
  },
  {
    lfmId: 130,
    aorId: "paul_ricard",
    name: "Circuit de Paul Ricard",
    flag: fr,
  },
  {
    lfmId: 131,
    aorId: "silverstone",
    name: "Silverstone",
    flag: gb,
  },
  {
    lfmId: 132,
    aorId: "spa",
    name: "Circuit de Spa-Francorchamps",
    flag: be,
  },
  {
    lfmId: 133,
    aorId: "zolder",
    name: "Zolder",
    flag: be,
  },
  {
    lfmId: 134,
    aorId: "imola",
    name: "Autodromo Enzo e Dino Ferrari",
    flag: it,
  },
  {
    lfmId: 135,
    aorId: "zandvoort",
    name: "Zandvoort",
    flag: nl,
  },
  {
    lfmId: 136,
    aorId: "mount_panorama",
    name: "Mount Panorama Circuit",
    flag: au,
  },
  {
    lfmId: 137,
    aorId: "suzuka",
    name: "Suzuka Circuit",
    flag: jp,
  },
  {
    lfmId: 138,
    aorId: "laguna_seca",
    name: "Laguna Seca",
    flag: us,
  },
  {
    lfmId: 139,
    aorId: "kyalami",
    name: "Kyalami",
    flag: za,
  },
  {
    lfmId: 140,
    aorId: "oulton_park",
    name: "Oulton Park",
    flag: gb,
  },
  {
    lfmId: 141,
    aorId: "donington",
    name: "Donington Park",
    flag: gb,
  },
  {
    lfmId: 142,
    aorId: "snetterton",
    name: "Snetterton",
    flag: gb,
  },
  {
    lfmId: 143,
    aorId: "indianapolis",
    name: "Indianapolis",
    flag: us,
  },
  {
    lfmId: 144,
    aorId: "watkins_glen",
    name: "Watkins Glen",
    flag: us,
  },
  {
    lfmId: 145,
    aorId: "cota",
    name: "Circuit of the Americas",
    flag: us,
  },
  {
    lfmId: 155,
    aorId: "valencia",
    name: "Circuit Ricardo Tormo",
    flag: es,
  },
];

export const CARS = {
  "alpine a110 gt4 GT4 (2018)": {
    lfmRelevant: false,
    img: alpine,
  },
  "amr v12 vantage GT3 (2013)": {
    lfmRelevant: false,
    img: aston,
  },
  "amr v8 vantage GT3 (2019)": {
    lfmRelevant: true,
    img: aston,
  },
  "aston martin vantage GT4 (2018)": {
    lfmRelevant: false,
    img: aston,
  },
  "audi r8 lms GT3 (2015)": {
    lfmRelevant: false,
    img: audi,
  },
  "audi r8 lms evo GT3 (2019)": {
    lfmRelevant: false,
    img: audi,
  },
  "audi r8 lms evo ii GT3 (2022)": {
    lfmRelevant: true,
    img: audi,
  },
  "bentley continental GT3 (2015)": {
    lfmRelevant: false,
    img: bentley,
  },
  "bentley continental GT3 (2018)": {
    lfmRelevant: true,
    img: bentley,
  },
  "bmw m2 cs BMW M2 (2022)": {
    lfmRelevant: false,
    img: bmw,
  },
  "bmw m4 GT3 (2022)": {
    lfmRelevant: true,
    img: bmw,
  },
  "bmw m4 GT4 (2018)": {
    lfmRelevant: false,
    img: bmw,
  },
  "bmw m6 GT3 (2017)": {
    lfmRelevant: false,
    img: bmw,
  },
  "chevrolet camaro GT4 (2017)": {
    lfmRelevant: false,
    img: chevrolet,
  },
  "emil frey jaguar g3 GT3 (2012)": {
    lfmRelevant: false,
    img: jaguar,
  },
  "ferrari 296 GT3 (2023)": {
    lfmRelevant: true,
    img: ferrari,
  },
  "ferrari 488 challenge evo FERRARI CHALLENGE (2020)": {
    lfmRelevant: false,
    img: ferrari,
  },
  "ferrari 488 GT3 (2015)": {
    lfmRelevant: false,
    img: ferrari,
  },
  "ferrari 488 evo GT3 (2020)": {
    lfmRelevant: false,
    img: ferrari,
  },
  "ginetta g55 GT4 (2012)": {
    lfmRelevant: false,
    img: ginetta,
  },
  "honda nsx evo GT3 (2019)": {
    lfmRelevant: true,
    img: honda,
  },
  "ktm x-bow GT4 (2016)": {
    lfmRelevant: false,
    img: ktm,
  },
  "lamborghini huracán GT3 (2015)": {
    lfmRelevant: false,
    img: lamborghini,
  },
  "lamborghini huracán evo GT3 (2019)": {
    lfmRelevant: false,
    img: lamborghini,
  },
  "lamborghini huracán evo 2 GT3 (2023)": {
    lfmRelevant: true,
    img: lamborghini,
  },
  "lamborghini huracán super trofeo evo2 ST (2022)": {
    lfmRelevant: false,
    img: lamborghini,
  },
  "lexus rc f GT3 (2016)": {
    lfmRelevant: false,
    img: lexus,
  },
  "maserati mc GT4 (2016)": {
    lfmRelevant: false,
    img: maserati,
  },
  "mclaren 570s GT4 (2016)": {
    lfmRelevant: false,
    img: mclaren,
  },
  "mclaren 650s GT3 (2015)": {
    lfmRelevant: false,
    img: mclaren,
  },
  "mclaren 720s GT3 (2019)": {
    lfmRelevant: false,
    img: mclaren,
  },
  "mclaren 720s evo GT3 (2023)": {
    lfmRelevant: true,
    img: mclaren,
  },
  "mercedes amg GT3 (2015)": {
    lfmRelevant: false,
    img: amg,
  },
  "mercedes amg GT4 (2016)": {
    lfmRelevant: false,
    img: amg,
  },
  "mercedes-amg GT3 (2020)": {
    lfmRelevant: true,
    img: amg,
  },
  "nissan gt-r nismo GT3 (2015)": {
    lfmRelevant: false,
    img: nissan,
  },
  "nissan gt-r nismo GT3 (2018)": {
    lfmRelevant: false,
    img: nissan,
  },
  "porsche 718 cayman GT4 (2019)": {
    lfmRelevant: false,
    img: porsche,
  },
  "porsche 991 ii r GT3 (2019)": {
    lfmRelevant: false,
    img: porsche,
  },
  "porsche 991 r GT3 (2018)": {
    lfmRelevant: false,
    img: porsche,
  },
  "porsche 992 cup CUP (2022)": {
    lfmRelevant: false,
    img: porsche,
  },
  "porsche 992 r GT3 (2023)": {
    lfmRelevant: true,
    img: porsche,
  },
  "porsche 718 cayman clubsport GT4 (2019)": {
    lfmRelevant: false,
    img: porsche,
  },
  "reiter engineering r-ex GT3 (2017)": {
    lfmRelevant: false,
    img: reiter,
  },
};

export const PROVIDERS = {
  LFM: {
    logo: lfm,
  },
  AOR: {
    logo: aor,
  },
};
