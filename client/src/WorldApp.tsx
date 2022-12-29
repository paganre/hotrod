import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Level, LevelMetadata } from "./types";

interface LevelProps {
  level: Level;
  handleMouseEnter: (metadataKey?: string) => void;
  handleMouseLeave: () => void;
  hovering?: string;
}

function LevelContainer(props: LevelProps) {
  const [flickerChar, setFlickerChar] = useState<string>();
  const [overrideStyles, setOverrideStyles] = useState<Level["style"]>({});
  let flickerIndex: number | undefined;
  useEffect(() => {
    if (
      props.level.flickeringChars !== undefined &&
      flickerIndex === undefined
    ) {
      flickerIndex = props.level.flickerIndex ? props.level.flickerIndex : 0;
      setInterval(() => {
        if (props.level.flickeringChars && flickerIndex !== undefined) {
          if (
            flickerIndex < props.level.flickeringChars.length &&
            flickerIndex >= 0
          ) {
            setFlickerChar(props.level.flickeringChars[flickerIndex]);
          } else {
            setFlickerChar("");
          }
          flickerIndex = (flickerIndex + 1) % 500;
        }
      }, 100);
    }
  }, []);
  const defaultStyle: Level["style"] = {
    left: props.level.location.y * 21,
    top: props.level.location.x * 21,
  };
  useEffect(() => {
    const newOverrideStyles: Level["style"] = {};
    if (props.hovering && props.hovering === props.level.metadataKey) {
      newOverrideStyles["background"] = "rgba(255,255,0,0.15)";
      newOverrideStyles["borderColor"] = "#ddd";
      newOverrideStyles["color"] = "black";
    }
    setOverrideStyles(newOverrideStyles);
  }, [props.hovering, props.level.metadataKey]);
  return (
    <div
      onMouseEnter={() => props.handleMouseEnter(props.level.metadataKey)}
      onMouseLeave={props.handleMouseLeave}
      className={`level-container ${
        props.level.target ? "level-container-clickable" : ""
      }`}
      style={{ ...defaultStyle, ...props.level.style, ...overrideStyles }}
      onClick={() => {
        if (props.level.target) {
          window.location.pathname = props.level.target;
        }
      }}
    >
      {props.level.title}
      {flickerChar}
    </div>
  );
}

function WorldApp() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelMetadata, setLevelMetadata] = useState<
    Record<string, LevelMetadata>
  >({});
  const [hoverMetadata, setHoverMetadata] = useState<string>();
  useEffect(() => {
    fetch(`/worldData`)
      .then((res) => res.json())
      .then((data) => {
        setLevels(data.levels);
        setLevelMetadata(data.metadata);
      });
  }, []);
  const renderedLevels = levels.map((level, index) => (
    <LevelContainer
      level={level}
      key={index}
      handleMouseEnter={setHoverMetadata}
      handleMouseLeave={() => {
        setHoverMetadata(undefined);
      }}
      hovering={hoverMetadata}
    />
  ));
  return (
    <div className="hot-rod-app">
      <div className="hot-rod-world-info">
        <div className="section-title">Hot Rod</div>
        <p>Welcome!</p>
        <p>
          This is your world view and it will get larger as you complete levels
          as you might expect. Hover over a level or a section to learn more
          about it.
        </p>
        {levelMetadata && hoverMetadata && levelMetadata[hoverMetadata] && (
          <ReactMarkdown>
            {levelMetadata[hoverMetadata].description}
          </ReactMarkdown>
        )}
      </div>
      <div className="hot-rod-world">
        <div className="section-title">World</div>
        <div className="hot-rod-world-container">{renderedLevels}</div>
      </div>
    </div>
  );
}

export default WorldApp;
