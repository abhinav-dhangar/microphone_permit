"use client";

import * as animationData from "@/public/lottie/listening.json";
import { useLottie } from "lottie-react";

const ListeningLottie = () => {
  const defaultOptions = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-[60%] md:w-[60%]">{View}</div>
      </div>
    </>
  );
};

export default ListeningLottie;
