import React, { ChangeEvent, useState } from "react";
import update from "immutability-helper";

import { Box } from "./Box";
import { useDrop, XYCoord } from "react-dnd";

export interface DragItem {
  type: string;
  id: string;
  top: number;
  left: number;
}

function App() {
  const [boxes, setBoxes] = useState<{
    [key: string]: {
      top: number;
      left: number;
      file: string;
    };
  }>({});

  const [zoom, setZoom] = useState(1);

  const [, drop] = useDrop({
    accept: "image",
    drop(item: DragItem, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveBox(item.id, left, top);
      return undefined;
    },
  });

  const moveBox = (id: string, left: number, top: number) => {
    setBoxes(
      update(boxes, {
        [id]: {
          $merge: { left, top },
        },
      })
    );
  };

  const openFile1 = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      setBoxes(
        update(boxes, {
          $merge: {
            0: {
              left: 0,
              top: 0,
              file: URL.createObjectURL(evt.target.files[0]),
            },
          },
        })
      );
    }
  };
  const openFile2 = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      setBoxes(
        update(boxes, {
          $merge: {
            1: {
              left: 0,
              top: 0,
              file: URL.createObjectURL(evt.target.files[0]),
            },
          },
        })
      );
    }
  };

  console.log("zoom", zoom);

  return (
    <div>
      <div style={{ zIndex: 99 }}>
        <input type="file" onChange={openFile1} />
        <input type="file" onChange={openFile2} />
        <button onClick={() => setZoom((z) => z + 0.2)}>zoom in</button>
        <button onClick={() => setZoom(1)}>set original</button>
        <button onClick={() => setZoom((z) => z - 0.2)}>zoom out</button>
      </div>
      <div
        ref={drop}
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        {Object.keys(boxes).map((key) => {
          const { left, top, file } = boxes[key];
          return (
            <Box key={key} id={key} left={left} top={top} hideSourceOnDrag>
              <img src={file} style={{ opacity: 0.5 }} />
            </Box>
          );
        })}
      </div>
    </div>
  );
}

export default App;
