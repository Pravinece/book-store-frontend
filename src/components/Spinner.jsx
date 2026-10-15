import React from "react";

export default function Spinner() {
    let appUrl = import.meta.env.VITE_APP_URL;

    return (
      <div className="flex items-center justify-center min-h-[90vh] min-w-[70vw] m-2 ">
        <div
          className="flex items-center justify-center relative h-45 w-45 animate-[rotateY_3s_linear_infinite]"
          style={{ transformStyle: "preserve-3d", perspective: '1000px'  }}
        >
          {/* Front face */}
          <div
            className="h-45 w-45 absolute top-0 left-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={`/${appUrl}/brandLogo.png`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          {/* Back face */}
          <div
            className="h-45 w-45 absolute top-0 left-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <img
              src={`/${appUrl}/brandLogo.png`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }
  