import { ReactComponent as MigrationIcon } from "./static-assets/icons/migration.svg";
import { ReactComponent as VirusIcon } from "./static-assets/icons/virus.svg";
import { ReactComponent as EnergyProduceIcon } from "./static-assets/icons/energy-produce.svg";
import { ReactComponent as AgeGroupsIcon } from "./static-assets/icons/age-groups.svg";

import data from "./data.json";

const normalGroups = [
  {
    title: "COVID-19 Pandemie",
    icon: <VirusIcon />,
    datasets: ["2079325172", "147222245792", "1672511511532"],
  },
  {
    title: "Stromerzeugung",
    icon: <EnergyProduceIcon />,
    datasets: ["1473021857110", "201814251184"],
  },
];

const memoryGroups = [
  {
    title: "Altergruppen",
    icon: <AgeGroupsIcon />,
    datasets: ["2442339250115"],
  },
  {
    title: "Migration",
    icon: <MigrationIcon />,
    datasets: ["101997053117"],
  },
];

let groups;
if (window.location.href.includes("?")) {
  groups = memoryGroups;
} else {
  groups = normalGroups;
}

export const datasetGroups = groups.map((group) => ({
  ...group,
  datasets: group.datasets.map((id) => data.find((d) => d.id === id)),
}));
