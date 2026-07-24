import { useEffect, useState } from "react";
import img1 from "../../assets/Tumbleweeds/Tumbleweed1.png";
import img2 from "../../assets/Tumbleweeds/Tumbleweed2.png";
import img3 from "../../assets/Tumbleweeds/Tumbleweed3.png";
import img4 from "../../assets/Tumbleweeds/Tumbleweed4.png";
import img5 from "../../assets/Tumbleweeds/Tumbleweed5.png";
import img6 from "../../assets/Tumbleweeds/Tumbleweed6.png";

const IMAGES = [img1, img2, img3, img4, img5, img6];

export const Tumbleweeds = () => {
  const [weeds, setWeeds] = useState<any[]>([]);

  useEffect(() => {
    // 3개의 랜덤 회전초 생성
    const newWeeds = Array.from({ length: 3 }).map((_, i) => {
      const img = IMAGES[Math.floor(Math.random() * IMAGES.length)];
      const duration = 8 + Math.random() * 10; // 가로질러 가는 속도
      const delay = Math.random() * 20; // 시작 딜레이를 늘려서 더 듬성듬성 나오게
      const size = 60 + Math.random() * 60; // 크기
      const bounceHeight = 50 + Math.random() * 200; // 튀어오르는 높이
      const bounceDuration = 0.8 + Math.random() * 2.0; // 한 번 튀기는 시간
      const rotateDuration = 2.8 + Math.random() * 1.5; // 구르는 속도

      return {
        id: i,
        img,
        duration,
        delay,
        size,
        bounceHeight,
        bounceDuration,
        rotateDuration,
      };
    });
    setWeeds(newWeeds);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <style>{`
        @keyframes rollAcross {
          0% { transform: translateX(110vw); }
          100% { transform: translateX(-30vw); }
        }
        @keyframes bounceHeight {
          0%, 100% { transform: translateY(0px); animation-timing-function: ease-out; }
          50% { transform: translateY(var(--bounce-height)); animation-timing-function: ease-in; }
        }
        @keyframes rotateWeed {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>

      {weeds.map((weed) => (
        <div
          key={weed.id}
          className="absolute bottom-2 will-change-transform"
          style={{
            animation: `rollAcross ${weed.duration}s linear infinite`,
            animationDelay: `-${weed.delay}s`,
            left: 0,
          }}
        >
          <div
            className="will-change-transform drop-shadow-xl"
            style={
              {
                animation: `bounceHeight ${weed.bounceDuration}s infinite`,
                animationDelay: `-${weed.delay}s`,
                "--bounce-height": `-${weed.bounceHeight}px`,
              } as any
            }
          >
            <img
              src={weed.img}
              alt="Tumbleweed"
              style={{
                width: `${weed.size}px`,
                height: `${weed.size}px`,
                animation: `rotateWeed ${weed.rotateDuration}s linear infinite`,
              }}
              className="object-contain opacity-70 sepia-[.3] hue-rotate-[-10deg]"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
