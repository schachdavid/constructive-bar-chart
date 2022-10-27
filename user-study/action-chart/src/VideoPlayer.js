import { useEffect, useRef, useState } from "react";

const VIDEOS_SRCS = [
  "a01.mov",
  "a02.mov",
  "a03.mp4",
  "a04.mp4",
  "a05.mp4",
  "b01.mp4",
  "b02.mp4",
  "b03.mp4",
  "b04.mp4",
  "b05.mp4",
];

function VideoPlayer() {
  const vidRef = useRef(null);
  const textareaRef = useRef(null);
  const [id, setId] = useState("a01");
  const [oldBlocks, setOldBlocks] = useState(0);
  const [nBlocks, setNBlocks] = useState(4);
  const [data, setData] = useState("");
  const [videoSrc, setVideoSrc] = useState(VIDEOS_SRCS[0]);

  useEffect(() => {
    vidRef.current.playbackRate = 2.0;
  }, [vidRef]);

  const handleButtonClick = (type) => {
    const time = Math.round(vidRef.current.currentTime) - 1;
    setData(data + `${id},${time},${type}\n`);
    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
  };

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  const options = VIDEOS_SRCS.map((d) => (
    <option value={d} key={d}>
      {d}
    </option>
  ));

  const handleSelectChange = (event) => {
    vidRef.current.pause();
    setVideoSrc(event.target.value);
    setId(event.target.value.split(".")[0]);
    vidRef.current.load();
    vidRef.current.play();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <select value={videoSrc} onChange={handleSelectChange}>
        {options}
      </select>
      <video ref={vidRef} height="800" controls>
        {videoSrc && <source src={videoSrc} type="video/mp4" />}
      </video>
      <div>
        <button onClick={() => handleButtonClick("understand")}>
          Verstehen
        </button>
        <button onClick={() => handleButtonClick("read")}>Lesen</button>
        <button onClick={() => handleButtonClick("guess")}>Schätzen</button>
        <button onClick={() => handleButtonClick("correct")}>
          Korrigieren
        </button>
        <button onClick={() => handleButtonClick("experiment")}>
          Experementieren
        </button>
        <button onClick={() => handleButtonClick("other")}>
          Andere/Nichts
        </button>
        participant_id
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
        ></input>
      </div>
      <textarea
        ref={textareaRef}
        style={{ height: 200 }}
        value={data}
        onChange={handleDataChange}
      ></textarea>
    </div>
  );
}

export default VideoPlayer;
