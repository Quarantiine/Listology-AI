import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";

const GalleryModal = ({ setOpenGalleryModal }) => {
	const { setBannerImage } = useContext(StateCtx);
	const { auth, registration } = FirebaseApi();
	const { user } = useContext(UserCredentialCtx);
	const [moreBtn, setMoreBtn] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const galleryRef = useRef();

	const { data, isLoading, refetch } = useQuery(
		"banner-pictures",
		async () => {
			return await axios.get(
				`https://picsum.photos/v2/list?page=${pageNumber}&limit=${30 + moreBtn}`
			);
		},
		{ refetchInterval: 100 }
	);

	const handleMoreBtn = () => {
		setMoreBtn((state) => (state >= data.data.length ? state : state + 10));
		refetch();
	};

	const handlePrevPage = () => {
		setPageNumber(pageNumber === 1 ? 1 : pageNumber - 1);
		setMoreBtn(0);
		galleryRef.current.scrollTo(0, 0);
		refetch();
	};

	const handleNextPage = () => {
		setPageNumber(pageNumber + 1);
		setMoreBtn(0);
		galleryRef.current.scrollTo(0, 0);
		refetch();
	};

	useEffect(() => {
		const closeGalleryModal = (e) => {
			if (!e.target.closest(".gallery-modal")) {
				setOpenGalleryModal(false);
			}
		};

		document.addEventListener("mousedown", closeGalleryModal);
		return () => document.removeEventListener("mousedown", closeGalleryModal);
	}, [setOpenGalleryModal]);

	return (
		<>
			<div className="fixed z-50 flex flex-col justify-center items-center top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.8)] gap-5">
				<div
					ref={galleryRef}
					className="gallery-modal gallery-overflow bg-white w-[80%] md:w-[60%] h-[70%] rounded-md p-5 overflow-y-scroll overflow-x-hidden"
				>
					<div className="relative w-full h-auto flex flex-wrap gap-5 justify-center items-start">
						{isLoading && <ImagePlaceholder />}
						{data?.data.slice(10).map((image, index) => {
							return (
								<AllImages
									key={image.id}
									user={user}
									registration={registration}
									image={image}
									index={index}
									setBannerImage={setBannerImage}
									setOpenGalleryModal={setOpenGalleryModal}
								/>
							);
						})}
						{moreBtn !== 70 && (
							<div className="w-full flex justify-center items-center">
								<button
									onClick={handleMoreBtn}
									className="base-btn w-full md:w-[50%] text-center"
								>
									more
								</button>
							</div>
						)}{" "}
					</div>
				</div>
				<div className="gallery-modal flex flex-col justify-center items-center gap-2 w-full h-fit mt-5">
					<div className="flex justify-center items-center gap-10 w-[80%] md:w-[60%]">
						{pageNumber !== 1 && (
							<button
								onClick={() => {
									handlePrevPage();
								}}
								className="base-btn w-full md:w-[50%] text-center"
							>
								prev page
							</button>
						)}
						{pageNumber !== 10 && (
							<button
								onClick={() => {
									handleNextPage();
								}}
								className="base-btn w-full md:w-[50%] text-center"
							>
								next page
							</button>
						)}{" "}
					</div>
				</div>
			</div>
		</>
	);
};

const AllImages = ({
	image,
	index,
	setBannerImage,
	setOpenGalleryModal,
	user,
	registration,
}) => {
	const [loaded, setLoaded] = useState(false);
	const clickedImageLoadingRef = useRef();
	const { setClickedImageLoading } = useContext(StateCtx);

	const handleImageBtn = () => {
		clearTimeout(clickedImageLoadingRef.current);
		setOpenGalleryModal(false);
		setBannerImage(image.download_url);
		registration?.updatingBannerImage(image.download_url, user.id);

		setClickedImageLoading(true);
		clickedImageLoadingRef.current = setTimeout(() => {
			setClickedImageLoading(false);
		}, 10000);
	};

	return (
		<>
			<div
				className={`relative flex justify-center items-center w-[250px] h-fit`}
			>
				{!loaded && (
					<div className="absolute w-full h-full bg-gray-300 rounded-md animate-pulse"></div>
				)}
				<Image
					onClick={handleImageBtn}
					className="w-[270px] h-auto object-cover object-center rounded-md text-btn"
					src={image.download_url}
					alt={`img ${index}`}
					width={296}
					height={296}
					onLoad={() => setLoaded(true)}
				/>
			</div>
		</>
	);
};

const ImagePlaceholder = () => {
	return (
		<>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
			<div className="w-[230px] h-[160px] bg-gray-300 rounded-md animate-pulse"></div>
		</>
	);
};

export default GalleryModal;
