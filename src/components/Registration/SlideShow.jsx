import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import imgs from "../../data/registration_images.json";

export default function SlideShow() {
	const slideCountRef = useRef();
	const [slideCount, setSlideCount] = useState(0);

	useEffect(() => {
		slideCountRef.current = setInterval(() => {
			setSlideCount((state) => state + 1);
			slideCount >= imgs.length - 1 ? setSlideCount(0) : null;
		}, 5000);

		return () => clearInterval(slideCountRef.current);
	}, [slideCount]);

	return (
		<>
			<div className="hidden md:block relative w-full h-full left-0 top-0 bg-gray-200 overflow-hidden">
				{imgs.map((img, index) => {
					return (
						<React.Fragment key={index}>
							<Image
								className={`w-auto object-cover object-center transition-all duration-[5000ms] ${
									slideCount === index ? "opacity-100" : "opacity-0"
								}`}
								src={img.src}
								alt={`registration-img ${index}`}
								draggable={false}
								fill
								sizes="true"
								priority={img.id === 1 ? true : null}
							/>
						</React.Fragment>
					);
				})}
			</div>
		</>
	);
}
