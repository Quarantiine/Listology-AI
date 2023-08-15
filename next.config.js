/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

module.exports = nextConfig;

module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
				pathname: "/id/**",
			},

			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
			},
		],
	},
};
