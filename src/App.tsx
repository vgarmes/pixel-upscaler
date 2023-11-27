import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { useRef, useState } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  //const [scaleFactor, setScaleFactor] = useState(4);
  const scaleFactor = 10;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleScale = () => {
    const img = new Image();

    img.onload = function () {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current?.getContext('2d');
      canvasRef.current.width = img.width * scaleFactor;
      canvasRef.current.height = img.height * scaleFactor;

      // Disable image smoothing to maintain pixel art style
      ctx!.imageSmoothingEnabled = false;
      ctx!.drawImage(
        img,
        0,
        0,
        img.width * scaleFactor,
        img.height * scaleFactor
      );

      if (containerRef.current) {
        // Calculate the center position
        const container = containerRef.current;
        const centerX = (img.width * scaleFactor - container.clientWidth) / 2;
        const centerY = (img.height * scaleFactor - container.clientHeight) / 2;

        // Scroll to the center position
        container.scrollTo(centerX, centerY);
      }
    };

    img.src = imageUrl;
  };
  return (
    <div className="flex flex-col items-center w-full px-3 gap-3 pt-3">
      <Input
        className="max-w-sm"
        label="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button onClick={handleScale}>Scale!</Button>
      <div
        ref={containerRef}
        className="w-64 h-64 overflow-x-auto overflow-y-auto border border-white"
      >
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
