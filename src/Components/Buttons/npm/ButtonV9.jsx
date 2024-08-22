import React, { useState } from "react";

const ButtonV9 = ({ title, color, borderRadius, className }) => {
  const [hovered, setHovered] = useState(false);

  const borderRadiusValue = borderRadius || "12px";
  const gradientColor = color || "#ff00aa";
  const gradientColorDark = `rgba(${parseInt(gradientColor.slice(1, 3), 16)}, ${parseInt(gradientColor.slice(3, 5), 16)}, ${parseInt(gradientColor.slice(5, 7), 16)}, 0.7)`;
  const gradientColorMedium = `rgba(${parseInt(gradientColor.slice(1, 3), 16)}, ${parseInt(gradientColor.slice(3, 5), 16)}, ${parseInt(gradientColor.slice(5, 7), 16)}, 0.3)`;
  const gradientColorLight = `rgba(${parseInt(gradientColor.slice(1, 3), 16)}, ${parseInt(gradientColor.slice(3, 5), 16)}, ${parseInt(gradientColor.slice(5, 7), 16)}, 0.1)`;

  return (
    <div
      className={`flex cursor-pointer items-center justify-center gap-2 px-3 py-2 transition-all duration-300 ease-out hover:brightness-125 ${className} `}
      style={{
        backgroundImage: `linear-gradient(to right, #0C090F -20%, ${gradientColorDark} 100%, ${gradientColor})`,
        boxShadow: hovered
          ? `inset 0px 2px 3px 0 rgba(255,255,255,0.1), inset 0 0px 3px 0 rgba(255,255,255,0.4), inset 0 -5px 20px 0 rgba(255,255,255,0.15), -1px 2px 4px rgba(0,0,0,0.3), 0px 0px 30px ${gradientColorMedium}`
          : `inset 0px 2px 3px 0 rgba(255,255,255,0.02), inset 0 0px 3px 0 rgba(255,255,255,0.2), inset 0 -5px 20px 0 rgba(255,255,255,0.1), 0px 2px 4px rgba(0,0,0,0.2), 0px 0px 30px ${gradientColorLight}`,
        transition: "all 0.3s ease-out",
        borderRadius: borderRadiusValue ? borderRadiusValue : "12px",
      }}
      onMouseEnter={(e) => {
        setHovered(true);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
      }}
    >
      <h3
        className="box-border bg-clip-text text-lg font-[500] text-transparent transition-all duration-300 ease-out"
        style={{
          backgroundImage: "linear-gradient(to top, #fff5, #ffff)",
        }}
      >
        {title}
      </h3>
      <svg
        className="w-5"
        width="20"
        height="21"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Union"
          fill-rule="evenodd"
          clipRule="evenodd"
          d="M20.0303 4.96967C18.9074 3.84678 17.0925 3.84678 15.9696 4.96967L2.96961 17.9697C1.84672 19.0926 1.84672 20.9074 2.96961 22.0303C4.0925 23.1532 5.90738 23.1532 7.03027 22.0303L18.5348 10.5258C18.5366 10.524 18.5385 10.5222 18.5403 10.5203C18.5422 10.5185 18.544 10.5166 18.5459 10.5147L20.0303 9.03033C21.1532 7.90744 21.1532 6.09257 20.0303 4.96967ZM18.01 8.9293L18.9696 7.96967C19.5067 7.43257 19.5067 6.56744 18.9696 6.03033C18.4325 5.49323 17.5674 5.49323 17.0303 6.03033L16.0706 6.98996L18.01 8.9293ZM15.01 8.05062L4.03027 19.0303C3.49316 19.5674 3.49316 20.4326 4.03027 20.9697C4.56738 21.5068 5.4325 21.5068 5.96961 20.9697L16.9493 9.98996L15.01 8.05062Z"
          fill="#fffc"
        />
        <path
          id="pathR"
          d="M15.5001 15.9999C16.0922 10.6996 10.5002 0.49997 1.84753 3.99994"
          stroke="black"
          strokeOpacity="0.0"
          stroke-width="0.5"
        />
        <path
          id="pathL2"
          d="M2.00007 1.50057C7.15264 0.123996 14 3 11.0002 12.0006"
          stroke="black"
          strokeOpacity="0.0"
          stroke-width="0.5"
        />
        <path
          id="pathL1"
          d="M2.14762 3.00172C10 2 12.9999 5.99981 13 11"
          stroke="black"
          strokeOpacity="0.0"
          stroke-width="0.5"
        />
        <path
          id="starL1"
          d="M6.5 1.44L8 1L7.56 2.5L8 4L6.5 3.56L5 4L5.44 2.5L5 1L6.5 1.44Z"
          stroke="#fffc"
          strokeWidth="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <animateMotion
            dur={hovered ? "1.5s" : "0s"}
            repeatCount="indefinite"
            keyPoints="0;1;0"
            keyTimes="0;0.6;1"
            calcMode="linear"
          >
            <mpath href="#pathL1" />
          </animateMotion>
          {/* rotate */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 6.5 2.5"
            to="360 6.5 2.5"
            dur={hovered ? "2.5s" : "0s"}
            repeatCount="indefinite"
          />
          {/* opacity */}
          <animate
            attributeName="stroke-opacity"
            values="0.8;1;0.2"
            dur={hovered ? "1.5s" : "0s"}
            repeatCount="indefinite"
            keyTimes="0;0.4;1"
            calcMode="linear"
          />
        </path>
        <path
          id="starL2"
          d="M4.5 9.44L6 9L5.56 10.5L6 12L4.5 11.56L3 12L3.44 10.5L3 9L4.5 9.44Z"
          stroke="#fffc"
          strokeWidth="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <animateMotion
            dur={hovered ? "2s" : "0s"}
            repeatCount="indefinite"
            keyPoints="0;1;0"
            keyTimes="0;0.4;1"
            calcMode="linear"
            begin="1s"
          >
            <mpath href="#pathL2" />
          </animateMotion>
          {/* rotate */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 4.5 9.44"
            to="360 4.5 9.44"
            dur={hovered ? "2s" : "0s"}
            repeatCount="indefinite"
          />
          {/* opacity */}
          <animate
            attributeName="stroke-opacity"
            values="0.5;1;0.8"
            dur={hovered ? "3s" : "0s"}
            repeatCount="indefinite"
            keyTimes="0;0.4;1"
            calcMode="linear"
          />
        </path>
        <path
          d="M2.5 1.44L4 1L3.56 2.5L4 4L2.5 3.56L1 4L1.44 2.5L1 1L2.5 1.44Z"
          stroke="#fffc"
          strokeWidth="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <animateMotion
            dur={hovered ? "1.5s" : "0s"}
            repeatCount="indefinite"
            keyPoints="0;1;0"
            keyTimes="0;0.6;1"
            calcMode="linear"
            begin="1"
          >
            <mpath href="#pathR" />
          </animateMotion>
          {/* rotate */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 2.5 1.44"
            to="360 2.5 1.44"
            dur={hovered ? "2.5s" : "0s"}
            repeatCount="indefinite"
            begin="1"
          ></animateTransform>
          {/* opacity */}
          <animate
            attributeName="stroke-opacity"
            values="0.5;1;0.1"
            dur={hovered ? "2.5s" : "0s"}
            repeatCount="indefinite"
            keyTimes="0;0.4;1"
            calcMode="linear"
          />
        </path>
      </svg>
    </div>
  );
};

export default ButtonV9;
