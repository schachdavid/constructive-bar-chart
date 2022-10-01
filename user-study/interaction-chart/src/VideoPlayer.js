import { useEffect, useRef, useState } from "react";

function VideoPlayer() {
  const vidRef = useRef(null);
  const textareaRef = useRef(null);
  const [id, setId] = useState("");
  const [oldBlocks, setOldBlocks] = useState(0);
  const [nBlocks, setNBlocks] = useState(4);
  const [data, setData] = useState("");

  useEffect(() => {
    vidRef.current.playbackRate = 2.0;
  }, [vidRef]);

  const handleButtonClick = (type, quantity) => {
    const time = Math.round(vidRef.current.currentTime) - 1;
    if (type === "block_move") {
      if (quantity) setData(data + `${id},${time},block_move,${quantity},\n`);
      else setData(data + `${id},${time},block_move,${nBlocks},\n`);
    } else if (type === "dataset_selection") {
      setData(data + `${id},${time},dataset_selection,,${oldBlocks}\n`);
    } else if (type === "button_press") {
      setData(data + `${id},${time},button_press,,\n`);
    }

    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
  };

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <video ref={vidRef} height="400" controls>
        <source src="B05.mp4" type="video/mp4" />
      </video>
      <div>
        <button onClick={() => handleButtonClick("dataset_selection")}>
          Datensatz
        </button>
        Klötze davor{" "}
        <input
          type="text"
          value={oldBlocks}
          onChange={(e) => setOldBlocks(e.target.value)}
        ></input>
        <button onClick={() => handleButtonClick("button_press")}>
          Button-Click
        </button>
        <button onClick={() => handleButtonClick("block_move", 1)}>
          Bewegung 1 Klotz
        </button>
        <button onClick={() => handleButtonClick("block_move", 2)}>
          Bewegung 2 Klötze
        </button>
        <button onClick={() => handleButtonClick("block_move", 3)}>
          Bewegung 3 Klötze
        </button>
        <button onClick={() => handleButtonClick("block_move")}>
          Bewegung n Klötze
        </button>
        Anzahl Klötze{" "}
        <input
          type="text"
          value={nBlocks}
          onChange={(e) => setNBlocks(e.target.value)}
        ></input>
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
