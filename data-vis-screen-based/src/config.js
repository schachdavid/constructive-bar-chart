import { ReactComponent as MoneyIcon } from "./static-assets/icons/money.svg";
import { ReactComponent as VirusIcon } from "./static-assets/icons/virus.svg";
import { ReactComponent as EnergyProduceIcon } from "./static-assets/icons/energy-produce.svg";

import data from "./data.json";

const groups = [
  {
    title: "Vermögen",
    icon: <MoneyIcon />,
    datasets: ["214254223626", "2", "3"],
  },
  {
    title: "COVID-19 Pandemie",
    icon: <VirusIcon />,
    datasets: ["2079325172", "147222245792"],
  },
  {
    title: "Stromerzeugung",
    icon: <EnergyProduceIcon />,
    datasets: ["12341234", "000000000", "5"],
  },
  
];

export const datasetGroups = groups.map((group) => ({
  ...group,
  datasets: group.datasets.map((id) => data.find((d) => d.id === id)),
}));
