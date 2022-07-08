export const globalEmissions = {
  title: "Global annual CO₂ emissions",
  yAxisLabel: "billion tons CO₂",
  xKey: "label",
  yKey: "emission",
  data: [
    {
      label: "1950",
      emission: 60,
    },
    {
      label: "1965",
      emission: 110.32,
    },
    {
      label: "1980",
      emission: 190.49,
    },
    {
      label: "1995",
      emission: 230.45,
    },
    {
      label: "2010",
      emission: 330.34,
    },
  ],
};

export const datasetGroups = [
  {
    title: "Vermögen",
    icon: <div></div>,
    datasets: [      
      {
        id: "214254223626",
        title: "Wie ist das Vermögen in der deutschen Bevölkerung verteilt?",
        unit: "% des Gesamtvermögens",
        source: "bpb",
        fields: [
          {
            label: "Vermögens- schwächste 20% der Bevölkerung",
            value: 0,
          },
          {
            label: "Untere Mitte",
            value: 0.9,
          },
          {
            label: "Mitte",
            value: 5.5,
          },
          {
            label: "Obere Mitte",
            value: 19.2,
          },
          {
            label: "Vermögens- stärkste 20% der Bevölkerung",
            value: 75.6,
          },
        ],
      },
    ],
  },
  {
    title: "COVID-19 Pandemie",
    icon: <div></div>,
    datasets: [
      {
        id: "2079325172",
        title: (
          <>
            Wie viele Corona
            <br />
            Infektionen gab
            <br />
            es in Deutschland
            <br />
            in den Jahrehälften?
          </>
        ),
        unit: "Infektionen",
        source: "bpb",
        fields: [
          {
            label: "Sommer 2020",
            value: 251496,
          },
          {
            label: "Winter 2020/2021",
            value: 2371659,
          },
          {
            label: "Sommer 2021",
            value: 1504119,
          },
          {
            label: "Winter 2021/2022",
            value: 14697628,
          },
          {
            label: "Sommer 2022",
            value: 7445760,
          },
        ],
      },
      {
        id: "147222245792",
        title: (
          <>
            Wie viele Corona
            <br />
            Todesfällen gab
            <br />
            es in Deutschland
            <br />
            in den Jahrehälften?
          </>
        ),
        unit: "Todesfälle",
        fields: [
          {
            label: "Sommer 2020",
            value: 9362,
          },
          {
            label: "Winter 2020/2021",
            value: 65255,
          },
          {
            label: "Sommer 2021",
            value: 18574,
          },
          {
            label: "Winter 2021/2022",
            value: 33691,
          },
          {
            label: "Sommer 2022",
            value: 13170,
          },
        ],
      },
    ],
  },
  {
    title: "Strom-Mix",
    icon: <div></div>,
    datasets: [
      {
        title: "Woraus wurde 2016 in Deutschland der Strom erzeugt?",
      },
      {
        title: "Woraus wurde 2021 in Deutschland der Strom erzeugt?",
      },
    ],
  },
];
