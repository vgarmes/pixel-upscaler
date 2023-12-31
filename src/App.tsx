import { Button, Input, Slider } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [scaleFactor, setScaleFactor] = useState(1);
  const [image, setImage] = useState<HTMLImageElement>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const ctx = canvasRef.current?.getContext('2d');
    canvasRef.current.width = image.width * scaleFactor;
    canvasRef.current.height = image.height * scaleFactor;

    // Disable image smoothing to maintain pixel art style
    ctx!.imageSmoothingEnabled = false;
    ctx!.drawImage(
      image,
      0,
      0,
      image.width * scaleFactor,
      image.height * scaleFactor
    );

    if (containerRef.current) {
      // Calculate the center position
      const container = containerRef.current;
      const centerX = (image.width * scaleFactor - container.clientWidth) / 2;
      const centerY = (image.height * scaleFactor - container.clientHeight) / 2;

      // Scroll to the center position
      container.scrollTo(centerX, centerY);
    }
  }, [scaleFactor, image]);

  return (
    <div className="flex flex-col items-center w-full h-screen border-white p-3 gap-3 min-h-screen">
      <div className="flex w-full items-center gap-3 justify-center">
        <Input
          className="max-w-sm"
          label="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.currentTarget.value)}
        />
        <Button
          color="primary"
          onClick={() => {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => setImage(img);
          }}
        >
          Scale!
        </Button>
      </div>
      <Slider
        aria-label="scale"
        minValue={1}
        maxValue={10}
        step={1}
        color="foreground"
        value={scaleFactor}
        onChange={(e) => {
          if (typeof e !== 'number') return;
          setScaleFactor(e);
        }}
        className="max-w-sm"
        label="Scale"
      />

      <p
        className={`text-sm font-semibold ${image ? 'visible' : 'invisible'}`}
      >{`${(image?.width ?? 0) * scaleFactor} x ${
        (image?.height ?? 0) * scaleFactor
      } pixels`}</p>
      <div
        ref={containerRef}
        className="w-full rounded flex-grow overflow-x-auto overflow-y-auto border border-gray-500"
      >
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
