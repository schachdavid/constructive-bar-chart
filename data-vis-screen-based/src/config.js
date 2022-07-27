import { ReactComponent as MoneyIcon } from "./static-assets/money-icon.svg";
import { ReactComponent as VirusIcon } from "./static-assets/virus-icon.svg";
import data from "./data.json";

const groups = [
  {
    title: "Vermögen",
    icon: <MoneyIcon />,
    datasets: ["214254223626"],
  },
  {
    title: "COVID-19 Pandemie",
    icon: <VirusIcon />,
    datasets: ["2079325172", "147222245792"],
  },
];

export const datasetGroups = groups.map((group) => ({
  ...group,
  datasets: group.datasets.map((id) => data.find((d) => d.id === id)),
}));
